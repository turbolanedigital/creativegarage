<?php
header('Content-Type: application/json; charset=utf-8');

$apiKey = 'F2DUTq2EKN7XPyYD';
$base = 'https://tuningspecs.com';
$allowed = ['brand_id', 'model_id', 'generation_id', 'product_id'];

function fetch_url($url) {
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_TIMEOUT => 18,
      CURLOPT_SSL_VERIFYPEER => true,
      CURLOPT_USERAGENT => 'CreativeGarage/1.0'
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $code >= 200 && $code < 300 ? $body : false;
  }
  return @file_get_contents($url);
}

function absolute_url($url) {
  if (!$url) return '';
  if (preg_match('/^https?:\/\//', $url)) return $url;
  return 'https://tuningspecs.com' . $url;
}

function text_value($html) {
  return trim(html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
}

function parse_result($html) {
  $result = [
    'vehicle' => '',
    'image' => '',
    'dynograph' => '',
    'power' => ['standard' => '', 'tuned' => '', 'gain' => ''],
    'torque' => ['standard' => '', 'tuned' => '', 'gain' => ''],
    'specs' => []
  ];

  if (preg_match('/<h2 class="Vehicle__name[^"]*">(.*?)<\/h2>/s', $html, $m)) {
    $result['vehicle'] = text_value($m[1]);
  }
  if (preg_match('/<div class="Vehicle__image[^"]*">\s*<img src="([^"]+)"/s', $html, $m)) {
    $result['image'] = absolute_url($m[1]);
  }
  if (preg_match('/<img src="([^"]*dynograph\.php[^"]*size=big[^"]*)"/s', $html, $m)) {
    $result['dynograph'] = absolute_url(html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, 'UTF-8'));
  }

  if (preg_match('/<h2[^>]*>Power \(hp\)<\/h2>(.*?)<h2[^>]*>Torque Nm<\/h2>/s', $html, $m)) {
    preg_match_all('/EnginePower__result[^>]*>\s*([0-9]+)\s*<span>hp<\/span>/s', $m[1], $values);
    $result['power'] = [
      'standard' => $values[1][0] ?? '',
      'tuned' => $values[1][1] ?? '',
      'gain' => $values[1][2] ?? ''
    ];
  }

  if (preg_match('/<h2[^>]*>Torque Nm<\/h2>(.*?)(<div class="EnginePowerWrapper"|<div class="SectionRow|<\/main>)/s', $html, $m)) {
    preg_match_all('/EnginePower__result[^>]*>\s*([0-9]+)\s*<span>Nm<\/span>/s', $m[1], $values);
    $result['torque'] = [
      'standard' => $values[1][0] ?? '',
      'tuned' => $values[1][1] ?? '',
      'gain' => $values[1][2] ?? ''
    ];
  }

  if (preg_match('/<div class="SectionRow border-color Specifications">(.*?)<\/div>\s*<\/div>\s*(?:<div class="PoweredBy"|<\/main>)/s', $html, $m)) {
    preg_match_all('/<tr>\s*<td>(.*?)<\/td>\s*<td><strong>(.*?)<\/strong><\/td>\s*<\/tr>/s', $m[1], $rows, PREG_SET_ORDER);
    $seen = [];
    foreach ($rows as $row) {
      $label = text_value($row[1]);
      $value = text_value($row[2]);
      $key = $label . ':' . $value;
      if ($label && $value && !isset($seen[$key])) {
        $seen[$key] = true;
        $result['specs'][] = ['label' => $label, 'value' => $value];
      }
    }
  }

  return $result;
}

$query = [
  'sitekey' => 'dyno',
  'api' => $apiKey,
  'language' => 'pt'
];

foreach ($allowed as $key) {
  if (isset($_GET[$key]) && preg_match('/^\d+$/', $_GET[$key])) {
    $query[$key] = $_GET[$key];
  }
}

$url = $base . '/typeloader.php?' . http_build_query($query);
$body = fetch_url($url);
if ($body === false) {
  http_response_code(502);
  echo json_encode(['ok' => false, 'message' => 'Erro ao contactar TuningSpecs']);
  exit;
}

$data = json_decode($body, true);
if (!is_array($data)) {
  http_response_code(502);
  echo json_encode(['ok' => false, 'message' => 'Resposta inválida da TuningSpecs']);
  exit;
}

if (!empty($query['product_id']) && !empty($data['data']['item_url'])) {
  $resultUrl = $base . '/api/iframe.php?' . http_build_query([
    'user' => $apiKey,
    'language' => 'pt',
    'car' => $data['data']['item_url']
  ]);
  $html = fetch_url($resultUrl);
  if ($html !== false) {
    $data['data']['result'] = parse_result($html);
  }
}

echo json_encode(['ok' => true, 'data' => $data['data']], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
