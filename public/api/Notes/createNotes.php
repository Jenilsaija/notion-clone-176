<?php
    $arrCreateParams=isset($requesdata['create'])?$requesdata['create']:[];
    
    $result = $conn->query("INSERT INTO notes (addedby,addedat) 
    VALUES ('".$userID."',NOW())");
    
    if ($result) {
        $arrResponse["status"] = true;
        $arrResponse["message"] = "Expense created successfully";
        $arrResponse["noteid"] = $conn->insert_id;
    }else{
        $arrResponse["message"] = "Invalid Api Response";
    }
?>