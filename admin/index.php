<?php session_start(); if(!isset($_SESSION['cg_admin'])){ header('Location: login.php'); exit; } ?>
<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Painel Creative Garage</title><link rel="stylesheet" href="../css/style.css"><link rel="stylesheet" href="admin.css"></head><body class="admin-body">
<header class="admin-top"><div><img src="../assets/logo/creative-logo.webp" alt=""><strong>Creative Garage Admin</strong></div><nav><a href="../" target="_blank">Ver site</a><a href="logout.php">Sair</a></nav></header>
<main class="admin-layout">
  <aside class="admin-menu"><button data-tab="content" class="active">Conteúdo geral</button><button data-tab="services">Serviços</button><button data-tab="gallery">Galeria</button><button data-tab="partners">Parceiros</button><button data-tab="contact">Contacto</button></aside>
  <section class="admin-panel">
    <div class="admin-head"><h1 id="panelTitle">Conteúdo geral</h1><button class="btn btn-light" id="saveBtn">Guardar alterações</button></div>
    <div id="adminMessage"></div>
    <form id="adminForm" class="crud-form"></form>
  </section>
</main>
<script src="admin.js"></script>
</body></html>
