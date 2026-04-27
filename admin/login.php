<?php
session_start();
if (isset($_SESSION['cg_admin'])) {
  header('Location: index.php');
  exit;
}
$content = json_decode(@file_get_contents(__DIR__ . '/../data/content.json'), true) ?: [];
$logoPath = $content['logo'] ?? 'assets/logo/creative-logo.webp';
$logo = preg_match('/^(https?:)?\/\//', $logoPath) ? $logoPath : '../' . ltrim($logoPath, '/');
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $u = $_POST['user'] ?? '';
  $p = $_POST['pass'] ?? '';
  if ($u === 'admin' && $p === 'admin123') {
    $_SESSION['cg_admin'] = true;
    header('Location: index.php');
    exit;
  }
  $error = 'Dados inválidos';
}
?>
<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin Creative Garage</title><link rel="stylesheet" href="../css/style.css"><link rel="stylesheet" href="admin.css"></head><body class="admin-body"><main class="login-card"><img src="<?=htmlspecialchars($logo)?>" alt="Creative Garage"><h1>Painel Admin</h1><?php if($error): ?><p class="error"><?=htmlspecialchars($error)?></p><?php endif; ?><form method="post"><label>Utilizador<input name="user" value="admin"></label><label>Password<input type="password" name="pass" value="admin123"></label><button class="btn btn-light" type="submit">Entrar</button></form></main></body></html>
