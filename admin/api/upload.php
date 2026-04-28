<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['cg_admin'])) {
  http_response_code(401);
  echo json_encode(['ok' => false, 'message' => 'Não autenticado']);
  exit;
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'message' => 'Imagem inválida']);
  exit;
}

$file = $_FILES['image'];
$maxSize = 8 * 1024 * 1024;
if ($file['size'] > $maxSize) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'message' => 'A imagem deve ter no máximo 8MB']);
  exit;
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']);
$allowed = [
  'image/jpeg' => 'jpg',
  'image/png' => 'png',
  'image/webp' => 'webp',
  'image/gif' => 'gif',
  'image/svg+xml' => 'svg'
];

if (!isset($allowed[$mime])) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'message' => 'Formato não permitido']);
  exit;
}

$uploadDir = realpath(__DIR__ . '/../../assets');
if ($uploadDir === false) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'message' => 'Pasta assets inválida']);
  exit;
}

$targetDir = $uploadDir . DIRECTORY_SEPARATOR . 'uploads';
if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true)) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'message' => 'Não foi possível criar a pasta de uploads']);
  exit;
}

$baseName = pathinfo($file['name'], PATHINFO_FILENAME);
$baseName = preg_replace('/[^a-zA-Z0-9-_]+/', '-', strtolower($baseName));
$baseName = trim($baseName, '-') ?: 'imagem';
$filename = $baseName . '-' . date('YmdHis') . '-' . bin2hex(random_bytes(3)) . '.' . $allowed[$mime];
$target = $targetDir . DIRECTORY_SEPARATOR . $filename;

if (!move_uploaded_file($file['tmp_name'], $target)) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'message' => 'Erro ao guardar imagem']);
  exit;
}

echo json_encode([
  'ok' => true,
  'message' => 'Imagem enviada. Clica em Aplicar para guardar este card.',
  'path' => 'assets/uploads/' . $filename
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
