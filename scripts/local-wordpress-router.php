<?php

declare(strict_types=1);

$path = parse_url((string) ($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
$wordpress_root = dirname(__DIR__) . '/backend/.wordpress';

if (is_string($path) && $path !== '/') {
    $file = realpath($wordpress_root . $path);

    if ($file !== false && str_starts_with($file, $wordpress_root) && is_file($file)) {
        return false;
    }
}

require $wordpress_root . '/index.php';
