<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$dataFile = __DIR__ . '/../data/remap-creative.json';

function respond(mixed $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function normalize_text(?string $value): string
{
    return trim((string) $value);
}

if (!is_file($dataFile)) {
    respond(['error' => 'Remap data not found'], 500);
}

$items = json_decode((string) file_get_contents($dataFile), true);
if (!is_array($items)) {
    respond(['error' => 'Invalid remap data'], 500);
}

$action = $_GET['action'] ?? 'brands';
$brand = normalize_text($_GET['brand'] ?? null);
$model = normalize_text($_GET['model'] ?? null);

if ($action === 'brands') {
    $brands = [];
    foreach ($items as $item) {
        if (!empty($item['brand'])) {
            $brands[$item['brand']] = true;
        }
    }

    $payload = array_map(
        fn (string $name): array => ['brand' => $name],
        array_keys($brands)
    );
    usort($payload, fn (array $a, array $b): int => strnatcasecmp($a['brand'], $b['brand']));
    respond($payload);
}

if ($action === 'models') {
    if ($brand === '') {
        respond(['error' => 'Missing brand'], 400);
    }

    $models = [];
    foreach ($items as $item) {
        if (($item['brand'] ?? '') === $brand && !empty($item['model'])) {
            $models[$item['model']] = true;
        }
    }

    $payload = array_map(
        fn (string $name): array => ['name' => $name],
        array_keys($models)
    );
    usort($payload, fn (array $a, array $b): int => strnatcasecmp($a['name'], $b['name']));
    respond($payload);
}

if ($action === 'engines') {
    if ($brand === '' || $model === '') {
        respond(['error' => 'Missing brand or model'], 400);
    }

    $engines = [];
    foreach ($items as $item) {
        if (($item['brand'] ?? '') !== $brand || ($item['model'] ?? '') !== $model) {
            continue;
        }

        $nameParts = array_filter([
            $item['motorization'] ?? '',
            $item['version'] ?? '',
        ]);

        $engines[] = [
            'id' => $item['id'] ?? '',
            'name' => implode(' - ', $nameParts),
            'fuel' => $item['fuel'] ?? 'Combustivel nao indicado',
            'stockPower' => $item['stock_hp'] ?? null,
            'stockTorque' => $item['stock_nm'] ?? null,
            'stage1Power' => $item['mod_hp'] ?? null,
            'stage1Torque' => $item['mod_nm'] ?? null,
            'price' => $item['price'] ?? null,
            'ecu' => $item['ecu'] ?? '',
        ];
    }

    usort($engines, fn (array $a, array $b): int => strnatcasecmp($a['name'], $b['name']));
    respond($engines);
}

respond(['error' => 'Unknown action'], 400);
