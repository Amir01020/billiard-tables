<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['ok' => false, 'error' => 'method']));
}

// Honeypot: боты заполняют скрытое поле
if (!empty($_POST['website'])) {
    exit(json_encode(['ok' => true]));
}

$cfg = require __DIR__ . '/config.php';

$clean = fn($v) => htmlspecialchars(trim(mb_substr((string)$v, 0, 300)), ENT_QUOTES, 'UTF-8');
$form  = $clean($_POST['form'] ?? 'Заявка');
$name  = $clean($_POST['name'] ?? '');
$phone = $clean($_POST['phone'] ?? '');
$model = $clean($_POST['model'] ?? '');
$area  = $clean($_POST['area'] ?? '');

// Телефон обязателен всегда; имя - если поле есть в форме
if (strlen(preg_replace('/\D/', '', $phone)) < 9 || (isset($_POST['name']) && $name === '')) {
    http_response_code(422);
    exit(json_encode(['ok' => false, 'error' => 'validation']));
}

$lines = ["<b>{$form} - {$cfg['site_name']}</b>", ''];
if ($name !== '')  $lines[] = "<b>Имя:</b> {$name}";
$lines[] = "<b>Телефон:</b> {$phone}";
if (isset($_POST['model'])) $lines[] = '<b>Модель:</b> ' . ($model !== '' ? $model : 'не выбрана');
if ($area !== '')  $lines[] = "<b>Площадь помещения:</b> {$area} м²";
$lines[] = '';
$lines[] = '<i>' . date('d.m.Y H:i') . '</i>';

$ch = curl_init("https://api.telegram.org/bot{$cfg['bot_token']}/sendMessage");
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => ['chat_id' => $cfg['chat_id'], 'text' => implode("\n", $lines), 'parse_mode' => 'HTML'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 15,
]);
$resp = json_decode((string)curl_exec($ch), true);

echo json_encode(['ok' => !empty($resp['ok'])]);
