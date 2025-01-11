<?php
    $arrSanitizeParams=isset($requesdata['sanitize'])?$requesdata['sanitize']:[];
    
    $result = $conn->query("UPDATE notes SET endedat=NOW() where recid=?", [$arrSanitizeParams['note_id']] );
    
    if ($result) {
        $arrResponse["status"] = true;
        $arrResponse["message"] = "Expense Deleted successfully";
    }else{
        $arrResponse["message"] = "Something went wrong";
    }
?>