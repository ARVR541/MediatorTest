<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

define('DATA_DIR', __DIR__ . '/storage');
define('DATA_FILE', DATA_DIR . '/submissions.jsonl');

function now_iso()
{
    return gmdate('Y-m-d\TH:i:s\Z');
}

function starts_with($haystack, $needle)
{
    return strpos($haystack, $needle) === 0;
}

function text_length($value)
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }

    return strlen($value);
}

function is_list_array($value)
{
    if (!is_array($value)) {
        return false;
    }

    $index = 0;
    foreach (array_keys($value) as $key) {
        if ($key !== $index) {
            return false;
        }
        $index += 1;
    }

    return true;
}

function respond($status, $payload)
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function get_raw_body()
{
    $body = file_get_contents('php://input');
    if (is_string($body) && $body !== '') {
        return $body;
    }

    if (PHP_SAPI === 'cli') {
        $stdin = file_get_contents('php://stdin');
        if (is_string($stdin)) {
            return $stdin;
        }
    }

    return '';
}

function parse_json_body()
{
    $raw = get_raw_body();
    if (trim($raw) === '') {
        return [];
    }

    try {
        $payload = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    } catch (Throwable $exception) {
        throw new InvalidArgumentException("Тело запроса должно быть валидным JSON.");
    }

    if (!is_array($payload) || is_list_array($payload)) {
        throw new InvalidArgumentException("JSON должен быть объектом.");
    }

    return $payload;
}

function is_truthy($value)
{
    if (is_bool($value)) {
        return $value;
    }

    if (is_string($value)) {
        return in_array(strtolower(trim($value)), ['1', 'true', 'yes', 'on'], true);
    }

    if (is_int($value) || is_float($value)) {
        return $value !== 0;
    }

    return false;
}

function normalize_text($value, $field, $required = true, $min_len = 0, $max_len = 2000)
{
    if ($value === null) {
        if ($required) {
            throw new InvalidArgumentException("Поле '{$field}' обязательно.");
        }

        return null;
    }

    if (!is_string($value)) {
        throw new InvalidArgumentException("Поле '{$field}' должно быть строкой.");
    }

    $text = trim($value);
    $len = text_length($text);

    if ($required && $text === '') {
        throw new InvalidArgumentException("Поле '{$field}' обязательно.");
    }

    if ($text !== '' && $len < $min_len) {
        throw new InvalidArgumentException("Поле '{$field}' слишком короткое.");
    }

    if ($len > $max_len) {
        throw new InvalidArgumentException("Поле '{$field}' слишком длинное.");
    }

    if ($text === '') {
        return null;
    }

    return $text;
}

function parse_appointment_datetime($raw)
{
    if (!is_string($raw) || trim($raw) === '') {
        throw new InvalidArgumentException("Поле 'appointment_at' обязательно.");
    }

    $value = trim($raw);

    try {
        $parsed = new DateTimeImmutable($value);
    } catch (Throwable $exception) {
        throw new InvalidArgumentException("Некорректный формат даты и времени записи.");
    }

    $weekday = (int) $parsed->format('N');
    if ($weekday >= 6) {
        throw new InvalidArgumentException("Выбранный слот недоступен в выходные.");
    }

    $hour = (int) $parsed->format('G');
    if ($hour < 10 || $hour > 17) {
        throw new InvalidArgumentException("Выбранный слот недоступен.");
    }

    return $parsed;
}

function next_id()
{
    return (int) round(microtime(true) * 1000);
}

function ensure_storage_ready()
{
    if (!is_dir(DATA_DIR) && !mkdir(DATA_DIR, 0775, true) && !is_dir(DATA_DIR)) {
        throw new RuntimeException('Не удалось подготовить хранилище заявок.');
    }

    if (!is_file(DATA_FILE) && !touch(DATA_FILE)) {
        throw new RuntimeException('Не удалось создать файл хранилища заявок.');
    }
}

function write_submission($kind, $payload)
{
    ensure_storage_ready();

    $record = [
        'id' => next_id(),
        'kind' => $kind,
        'received_at' => now_iso(),
        'payload' => $payload,
    ];

    $line = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (!is_string($line)) {
        throw new RuntimeException('Не удалось сериализовать заявку.');
    }

    if (file_put_contents(DATA_FILE, $line . PHP_EOL, FILE_APPEND | LOCK_EX) === false) {
        throw new RuntimeException('Не удалось сохранить заявку.');
    }
}

function validate_lead($payload)
{
    $lead_type = normalize_text($payload['type'] ?? null, 'type', true, 1, 20);
    if (!in_array($lead_type, ['quick', 'contact'], true)) {
        throw new InvalidArgumentException("Поле 'type' должно быть quick или contact.");
    }

    $full_name = normalize_text($payload['full_name'] ?? null, 'full_name', true, 2, 120);
    $phone = normalize_text($payload['phone'] ?? null, 'phone', true, 6, 40);
    $email = normalize_text($payload['email'] ?? null, 'email', false, 0, 120);
    $message = normalize_text($payload['message'] ?? null, 'message', false, 0, 2000);
    $source = normalize_text($payload['source'] ?? null, 'source', false, 0, 120);
    if ($source === null) {
        $source = 'website';
    }

    if ($email !== null && !preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/u', $email)) {
        throw new InvalidArgumentException('Некорректный email.');
    }

    return [
        'id' => next_id(),
        'type' => $lead_type,
        'full_name' => $full_name,
        'email' => $email,
        'phone' => $phone,
        'message' => $message,
        'source' => $source,
        'status' => 'new',
    ];
}

function parse_positive_int($value, $field_name)
{
    $parsed = filter_var($value, FILTER_VALIDATE_INT);
    if ($parsed === false || $parsed <= 0) {
        throw new InvalidArgumentException("{$field_name} должен быть положительным числом.");
    }

    return (int) $parsed;
}

function validate_appointment($payload)
{
    try {
        $service_id = parse_positive_int($payload['service_id'] ?? null, 'service_id');
        $specialist_id = parse_positive_int($payload['specialist_id'] ?? null, 'specialist_id');
    } catch (InvalidArgumentException $exception) {
        if (strpos($exception->getMessage(), 'service_id') !== false || strpos($exception->getMessage(), 'specialist_id') !== false) {
            throw new InvalidArgumentException('service_id и specialist_id должны быть положительными.');
        }

        throw $exception;
    }

    $appointment_at = parse_appointment_datetime($payload['appointment_at'] ?? null);
    $full_name = normalize_text($payload['full_name'] ?? null, 'full_name', true, 2, 120);
    $phone = normalize_text($payload['phone'] ?? null, 'phone', true, 6, 40);
    $email = normalize_text($payload['email'] ?? null, 'email', false, 0, 120);
    $message = normalize_text($payload['message'] ?? null, 'message', false, 0, 2000);
    $consent = is_truthy($payload['consent'] ?? null);

    if (!$consent) {
        throw new InvalidArgumentException('Требуется согласие на обработку персональных данных.');
    }

    if ($email !== null && !preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/u', $email)) {
        throw new InvalidArgumentException('Некорректный email.');
    }

    return [
        'id' => next_id(),
        'service_id' => $service_id,
        'specialist_id' => $specialist_id,
        'appointment_at' => $appointment_at->format(DateTimeInterface::ATOM),
        'full_name' => $full_name,
        'email' => $email,
        'phone' => $phone,
        'message' => $message,
        'consent' => true,
        'status' => 'pending',
    ];
}

function request_path()
{
    $uriPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    if (!is_string($uriPath) || $uriPath === '') {
        return '/';
    }

    $apiPosition = strpos($uriPath, '/api');
    if ($apiPosition === false) {
        return $uriPath;
    }

    $path = substr($uriPath, $apiPosition + 4);
    if (!is_string($path) || $path === '') {
        return '/';
    }

    if (!starts_with($path, '/')) {
        $path = '/' . $path;
    }

    if ($path === '/index.php') {
        return '/';
    }

    if (starts_with($path, '/index.php/')) {
        $path = substr($path, strlen('/index.php'));
    }

    if ($path === '') {
        return '/';
    }

    return $path;
}

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$path = request_path();

if ($method === 'GET') {
    if ($path === '/health') {
        respond(200, ['status' => 'ok', 'time' => now_iso()]);
    }

    respond(404, ['message' => 'Маршрут не найден.']);
}

if ($method !== 'POST') {
    respond(405, ['message' => 'Метод не поддерживается.']);
}

try {
    $payload = parse_json_body();
} catch (InvalidArgumentException $exception) {
    respond(400, ['message' => $exception->getMessage()]);
}

try {
    if ($path === '/leads' || $path === '/contact') {
        $data = validate_lead($payload);
        write_submission('lead', $data);
        respond(201, ['data' => $data]);
    }

    if ($path === '/appointments') {
        $data = validate_appointment($payload);
        write_submission('appointment', $data);
        respond(201, ['data' => $data]);
    }

    respond(404, ['message' => 'Маршрут не найден.']);
} catch (InvalidArgumentException $exception) {
    respond(422, ['message' => $exception->getMessage()]);
} catch (RuntimeException $exception) {
    respond(500, ['message' => $exception->getMessage()]);
}
