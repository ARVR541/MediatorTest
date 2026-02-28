# Медиаторы Ямала

Проект подготовлен под деплой на **Beget (виртуальный хостинг)**:

- `frontend/` — сайт на React + TypeScript + Vite.
- `deploy/beget-template/public_html/` — шаблон прод-окружения:
  - `.htaccess` для SPA-роутинга React;
  - PHP API для форм заявок (`/api/*`);
  - защищённое файловое хранилище заявок.
- `scripts/prepare-beget.sh` — сборка готовой папки к загрузке на Beget.

## API (прод)

PHP API принимает формы:

- `POST /api/leads`
- `POST /api/contact` (алиас для leads)
- `POST /api/appointments`
- `GET /api/health`

Заявки сохраняются в:

- `public_html/api/storage/submissions.jsonl`

## Локальная разработка

1. Запустите backend (локально можно оставить Python-вариант):

```bash
python3 backend/server.py --host 127.0.0.1 --port 8090
```

2. Запустите frontend:

```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5180
```

3. Откройте:

- Frontend: `http://127.0.0.1:5180`
- Health: `http://127.0.0.1:8090/api/health`

Во frontend используется `VITE_FORMS_API_BASE_URL=/api`, а Vite-прокси отправляет `/api/*` на `127.0.0.1:8090` в режиме разработки.

## Сборка пакета для Beget

Из корня проекта:

```bash
./scripts/prepare-beget.sh
```

Скрипт создаст готовый пакет в:

- `deploy/beget/public_html`

## Деплой на Beget

1. Откройте файловый менеджер Beget.
2. Загрузите **содержимое** `deploy/beget/public_html` в `public_html` вашего домена.
3. Убедитесь, что используется PHP 8+ и включен `mod_rewrite` (обычно включено по умолчанию).
4. Проверьте:
   - `https://ВАШ-ДОМЕН/api/health` должно вернуть `{"status":"ok",...}`.
5. Отправьте тестовую заявку с сайта и проверьте появление записи в `public_html/api/storage/submissions.jsonl`.

## Где хранятся статические данные сайта

- `frontend/src/lib/contentStore.ts` — услуги, специалисты, документы, FAQ, кейсы, страницы.
- `frontend/public/files/documents/` — файлы документов для скачивания.
