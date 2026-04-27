<?php
session_start(); header('Content-Type: application/json; charset=utf-8');
if(!isset($_SESSION['cg_admin'])){ http_response_code(401); echo json_encode(['ok'=>false,'message'=>'Não autenticado']); exit; }
$allowed = ['content','services','gallery','partners'];
$type = $_GET['type'] ?? '';
if(!in_array($type,$allowed,true)){ http_response_code(400); echo json_encode(['ok'=>false,'message'=>'Tipo inválido']); exit; }
$input = file_get_contents('php://input');
$data = json_decode($input,true);
if($data===null){ http_response_code(400); echo json_encode(['ok'=>false,'message'=>'JSON inválido']); exit; }
$base = realpath(__DIR__.'/../../data');
$file = $base . DIRECTORY_SEPARATOR . $type . '.json';
if(!is_dir($base) || strpos(realpath(dirname($file)),$base)!==0){ http_response_code(500); echo json_encode(['ok'=>false,'message'=>'Pasta de dados inválida']); exit; }
$backupDir = $base . DIRECTORY_SEPARATOR . 'backups'; if(!is_dir($backupDir)) mkdir($backupDir,0755,true);
if(file_exists($file)) copy($file, $backupDir . DIRECTORY_SEPARATOR . $type . '-' . date('Ymd-His') . '.json');
$ok = file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
echo json_encode(['ok'=>$ok!==false,'message'=>$ok!==false?'Guardado com sucesso':'Erro ao guardar']);
