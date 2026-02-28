#!/usr/bin/env python3
"""Minimal backend for receiving site forms without a database."""

from __future__ import annotations

import argparse
import json
import re
import threading
import time
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_FILE = DATA_DIR / "submissions.jsonl"
WRITE_LOCK = threading.Lock()

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def now_iso() -> str:
    return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def parse_json_body(raw: bytes) -> dict[str, Any]:
    if not raw:
        return {}

    try:
        payload = json.loads(raw.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ValueError("Тело запроса должно быть валидным JSON.") from exc

    if not isinstance(payload, dict):
        raise ValueError("JSON должен быть объектом.")

    return payload


def is_truthy(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in {"1", "true", "yes", "on"}
    if isinstance(value, (int, float)):
        return value != 0
    return False


def normalize_text(value: Any, *, field: str, required: bool = True, min_len: int = 0, max_len: int = 2000) -> str | None:
    if value is None:
        if required:
            raise ValueError(f"Поле '{field}' обязательно.")
        return None

    if not isinstance(value, str):
        raise ValueError(f"Поле '{field}' должно быть строкой.")

    text = value.strip()

    if required and not text:
        raise ValueError(f"Поле '{field}' обязательно.")

    if text and len(text) < min_len:
        raise ValueError(f"Поле '{field}' слишком короткое.")

    if len(text) > max_len:
        raise ValueError(f"Поле '{field}' слишком длинное.")

    return text or None


def parse_appointment_datetime(raw: Any) -> datetime:
    if not isinstance(raw, str) or not raw.strip():
        raise ValueError("Поле 'appointment_at' обязательно.")

    value = raw.strip().replace("Z", "+00:00")

    try:
        parsed = datetime.fromisoformat(value)
    except ValueError as exc:
        raise ValueError("Некорректный формат даты и времени записи.") from exc

    if parsed.weekday() >= 5:
        raise ValueError("Выбранный слот недоступен в выходные.")

    if parsed.hour < 10 or parsed.hour > 17:
        raise ValueError("Выбранный слот недоступен.")

    return parsed


def write_submission(kind: str, payload: dict[str, Any]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    record = {
        "id": int(time.time() * 1000),
        "kind": kind,
        "received_at": now_iso(),
        "payload": payload,
    }

    with WRITE_LOCK:
        with DATA_FILE.open("a", encoding="utf-8") as out:
            out.write(json.dumps(record, ensure_ascii=False) + "\n")


def validate_lead(payload: dict[str, Any]) -> dict[str, Any]:
    lead_type = normalize_text(payload.get("type"), field="type", min_len=1, max_len=20)
    if lead_type not in {"quick", "contact"}:
        raise ValueError("Поле 'type' должно быть quick или contact.")

    full_name = normalize_text(payload.get("full_name"), field="full_name", min_len=2, max_len=120)
    phone = normalize_text(payload.get("phone"), field="phone", min_len=6, max_len=40)
    email = normalize_text(payload.get("email"), field="email", required=False, max_len=120)
    message = normalize_text(payload.get("message"), field="message", required=False, max_len=2000)
    source = normalize_text(payload.get("source"), field="source", required=False, max_len=120) or "website"

    if email and not EMAIL_RE.match(email):
        raise ValueError("Некорректный email.")

    return {
        "id": int(time.time() * 1000),
        "type": lead_type,
        "full_name": full_name,
        "email": email,
        "phone": phone,
        "message": message,
        "source": source,
        "status": "new",
    }


def validate_appointment(payload: dict[str, Any]) -> dict[str, Any]:
    try:
        service_id = int(payload.get("service_id"))
        specialist_id = int(payload.get("specialist_id"))
    except (TypeError, ValueError) as exc:
        raise ValueError("service_id и specialist_id должны быть числами.") from exc

    if service_id <= 0 or specialist_id <= 0:
        raise ValueError("service_id и specialist_id должны быть положительными.")

    appointment_at = parse_appointment_datetime(payload.get("appointment_at"))
    full_name = normalize_text(payload.get("full_name"), field="full_name", min_len=2, max_len=120)
    phone = normalize_text(payload.get("phone"), field="phone", min_len=6, max_len=40)
    email = normalize_text(payload.get("email"), field="email", required=False, max_len=120)
    message = normalize_text(payload.get("message"), field="message", required=False, max_len=2000)
    consent = is_truthy(payload.get("consent"))

    if not consent:
        raise ValueError("Требуется согласие на обработку персональных данных.")

    if email and not EMAIL_RE.match(email):
        raise ValueError("Некорректный email.")

    return {
        "id": int(time.time() * 1000),
        "service_id": service_id,
        "specialist_id": specialist_id,
        "appointment_at": appointment_at.isoformat(),
        "full_name": full_name,
        "email": email,
        "phone": phone,
        "message": message,
        "consent": True,
        "status": "pending",
    }


class ApiHandler(BaseHTTPRequestHandler):
    server_version = "FormsPythonBackend/1.0"

    def _set_headers(self, status: int, *, content_type: str = "application/json; charset=utf-8") -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def _read_body(self) -> bytes:
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0

        if length <= 0:
            return b""

        return self.rfile.read(length)

    def _json_response(self, status: int, payload: dict[str, Any]) -> None:
        self._set_headers(status)
        self.wfile.write(json.dumps(payload, ensure_ascii=False).encode("utf-8"))

    def log_message(self, fmt: str, *args: Any) -> None:
        timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {self.address_string()} - {fmt % args}")

    def do_OPTIONS(self) -> None:  # noqa: N802
        self._set_headers(204)

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/api/health":
            self._json_response(200, {"status": "ok", "time": now_iso()})
            return

        self._json_response(404, {"message": "Маршрут не найден."})

    def do_POST(self) -> None:  # noqa: N802
        try:
            payload = parse_json_body(self._read_body())
        except ValueError as exc:
            self._json_response(400, {"message": str(exc)})
            return

        try:
            if self.path in {"/api/leads", "/api/contact"}:
                data = validate_lead(payload)
                write_submission("lead", data)
                self._json_response(201, {"data": data})
                return

            if self.path == "/api/appointments":
                data = validate_appointment(payload)
                write_submission("appointment", data)
                self._json_response(201, {"data": data})
                return

            self._json_response(404, {"message": "Маршрут не найден."})
        except ValueError as exc:
            self._json_response(422, {"message": str(exc)})


def main() -> None:
    parser = argparse.ArgumentParser(description="Python backend for form submissions.")
    parser.add_argument("--host", default="127.0.0.1", help="Host to bind.")
    parser.add_argument("--port", type=int, default=8090, help="Port to bind.")
    args = parser.parse_args()

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        DATA_FILE.touch()

    httpd = ThreadingHTTPServer((args.host, args.port), ApiHandler)
    print(f"Forms backend started: http://{args.host}:{args.port}")
    print(f"Writing submissions to: {DATA_FILE}")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()
        print("Forms backend stopped.")


if __name__ == "__main__":
    main()
