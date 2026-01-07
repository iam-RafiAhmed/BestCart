<?php
// controllers/helpers.php
if (session_status() === PHP_SESSION_NONE) { session_start(); }

/**
 * Detect AJAX (fetch) request.
 */
function isAjax(){
    return isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
           $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest';
}

/**
 * Output JSON and stop execution.
 */
function jsonOut($status, $message, $data = []){
    // Clean any accidental buffered output so JSON stays valid
    while (ob_get_level() > 0) { @ob_end_clean(); }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['status'=>$status, 'message'=>$message, 'data'=>$data]);
    exit;
}

/**
 * For AJAX calls, prevent PHP notices/warnings/fatals from breaking JSON.
 * - Converts warnings/notices into JSON
 * - Converts fatal shutdown errors into JSON
 */
function enableAjaxSafeErrors(){
    if (!isAjax()) { return; }

    // Buffer any accidental output (warnings/echo)
    if (!ob_get_level()) { ob_start(); }

    // Turn warnings/notices into JSON (and stop)
    set_error_handler(function($errno, $errstr, $errfile, $errline){
        // Respect @ operator
        if (!(error_reporting() & $errno)) { return false; }

        // Clean buffer and respond
        if (ob_get_length()) { @ob_end_clean(); }
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'status'  => false,
            'message' => 'PHP error: '.$errstr,
            'data'    => ['file'=>$errfile, 'line'=>$errline, 'errno'=>$errno]
        ]);
        exit;
    });

    // Catch uncaught exceptions (mysqli_sql_exception etc.)
    set_exception_handler(function($ex){
        if (ob_get_level() > 0) { while (ob_get_level() > 0) { @ob_end_clean(); } }
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'status'  => false,
            'message' => 'Uncaught exception: '.$ex->getMessage(),
            'data'    => ['file'=>$ex->getFile(), 'line'=>$ex->getLine()]
        ]);
        exit;
    });

    // Catch fatal errors at shutdown
    register_shutdown_function(function(){
        $err = error_get_last();
        if ($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
            while (ob_get_level() > 0) { @ob_end_clean(); }
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status'  => false,
                'message' => 'Fatal error: '.$err['message'],
                'data'    => ['file'=>$err['file'], 'line'=>$err['line'], 'type'=>$err['type']]
            ]);
            exit;
        }
        // No fatal: flush buffer (don't discard!), otherwise response can become empty
        if (ob_get_level() > 0) { @ob_end_flush(); }
    });
}

/**
 * Require admin session.
 */
function requireAdmin(){
    if (!isset($_SESSION['admin_status'])) {
        if (isAjax()) jsonOut(false, "Unauthorized");
        header("Location: ../views/admin/login.php");
        exit;
    }
}

// Enable AJAX-safe error responses early
enableAjaxSafeErrors();
?>