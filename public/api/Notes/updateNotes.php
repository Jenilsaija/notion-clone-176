<?php
    $arrSanitizedParams = isset($requesdata['sanitizer'])?$requesdata['sanitizer']:[];
    $arrUpdateParams=isset($requesdata['update'])?$requesdata['update']:[];

    $query = "UPDATE notes SET ";
    $i=0;   
    foreach ($arrUpdateParams as $key => $value) {
        $query .= $key."='".$value;
        if ($i<count($arrUpdateParams)-1) {
            $query .= "',";
        }else{
            $query .= "'";
        }
        $i++;
    }

    $query.=" WHERE recid='".$arrSanitizedParams['notes_id']."'";

    $result = $conn->query($query);
    
    if ($result) {
        $arrResponse["status"] = true;
        $arrResponse["message"] = "Expense Updated successfully";
    }else{
        $arrResponse["message"] = "Invalid Api Response";
    }
?>