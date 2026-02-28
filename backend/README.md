# Python Forms Backend (legacy/local)

Этот backend оставлен для локальной разработки и smoke-тестов.

Для продакшн-деплоя на Beget используется PHP API из:

- `deploy/beget-template/public_html/api/index.php`

## Маршруты

- `POST /api/leads`
- `POST /api/contact` (алиас для leads)
- `POST /api/appointments`
- `GET /api/health`

## Запуск

```bash
python3 backend/server.py --host 127.0.0.1 --port 8090
```
