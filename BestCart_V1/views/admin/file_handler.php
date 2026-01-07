<?php
// views/admin/file_handler.php
// Safe upload helper (works from both views and controllers)


function sanitizeFileNameSimple($name) {
    $name = basename($name);
    $out = "";
    $len = strlen($name);
    for ($i = 0; $i < $len; $i++) {
        $ch = $name[$i];
        if (ctype_alnum($ch) || $ch === '.' || $ch === '_' || $ch === '-') {
            $out .= $ch;
        } else {
            $out .= '_';
        }
    }
    if ($out === "") {
        $out = "file";
    }
    return $out;
}

function uploadImage($file) {
    // 1) No file selected
    if (!isset($file['name']) || $file['name'] === "") {
        return "default.png";
    }

    // 2) Absolute filesystem path to /uploads
    $uploadDir = realpath(__DIR__ . "/../../uploads");
    if ($uploadDir === false) {
        // Try create if missing
        $uploadDir = __DIR__ . "/../../uploads";
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0777, true);
        }
        $uploadDir = realpath($uploadDir);
    }

    if ($uploadDir === false) {
        return "default.png";
    }

    // 3) Unique filename
    $safeName = sanitizeFileNameSimple($file['name']);
    $fileName = time() . "_" . $safeName;
    $targetFile = $uploadDir . DIRECTORY_SEPARATOR . $fileName;

    // 4) Move upload (suppress warnings to avoid breaking JSON)
    if (isset($file['tmp_name']) && $file['tmp_name'] !== "" && @move_uploaded_file($file['tmp_name'], $targetFile)) {
        return $fileName;
    }

    return "default.png";
}
?>