<?php
require_once('helpers.php');
requireAdmin();

require_once('../models/sliderModel.php');
require_once('../views/admin/file_handler.php'); // uploadImage()

// ADD SLIDER
if (isset($_POST['add_slider'])) {
    $title = $_POST['title'] ?? '';
    $subtitle = $_POST['subtitle'] ?? '';
    $image = uploadImage($_FILES['image'] ?? []);

    $ok = addSlider($title, $subtitle, $image);

    if (isAjax()) {
        if ($ok) jsonOut(true, "Slider added");
        jsonOut(false, "Failed to add slider");
    } else {
        header("Location: ../views/admin/manage_sliders.php");
        exit;
    }
}

// DELETE SLIDER
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $ok = deleteSlider($id);

    if (isAjax()) {
        if ($ok) jsonOut(true, "Slider deleted", ['id'=>$id]);
        jsonOut(false, "Failed to delete slider");
    } else {
        header("Location: ../views/admin/manage_sliders.php");
        exit;
    }
}

if (isAjax()) jsonOut(false, "Invalid request");
header("Location: ../views/admin/manage_sliders.php");
exit;
?>
