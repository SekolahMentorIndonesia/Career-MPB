<?php
/**
 * Fix permissions for upload directories and files in production.
 * Run this via browser or CLI on Hostinger if 403 errors persist.
 */

function fixPermissions($path) {
    if (!file_exists($path)) return;

    if (is_dir($path)) {
        echo "Fixing directory: $path (0755)\n";
        chmod($path, 0755);
        $items = scandir($path);
        foreach ($items as $item) {
            if ($item != "." && $item != "..") {
                fixPermissions($path . "/" . $item);
            }
        }
    } else {
        echo "Fixing file: $path (0644)\n";
        chmod($path, 0644);
    }
}

$uploadBase = __DIR__ . "/public/uploads";
if (is_dir($uploadBase)) {
    fixPermissions($uploadBase);
    echo "Permissions fixed successfully!\n";
} else {
    echo "Upload directory not found at $uploadBase\n";
}
