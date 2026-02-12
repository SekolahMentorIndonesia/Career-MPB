<?php

namespace App\Config;

class Env {
    private static $env = [];

    public static function load($path) {
        if (!file_exists($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) continue;

            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);

            // Strip quotes if any
            if (preg_match('/^"(.*)"$/', $value, $matches) || preg_match("/^'(.*)'$/", $value, $matches)) {
                $value = $matches[1];
            }

            self::$env[$name] = $value;
            putenv("{$name}={$value}");
        }
    }

    public static function get($name, $default = null) {
        return self::$env[$name] ?? getenv($name) ?: $default;
    }
}
