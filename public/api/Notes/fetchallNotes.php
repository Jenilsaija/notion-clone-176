<?php
    $arrSanitizeParams=isset($requesdata['sanitize'])?$requesdata['sanitize']:[];
    $searchby=isset($arrSanitizeParams['searchby'])?$arrSanitizeParams['searchby']:'';
    $search=isset($arrSanitizeParams['search'])?$arrSanitizeParams['search']:'';
    $query = "select * from notes where endedat is null";
    
    switch ($searchby) {
        case 'ALL':

            break;
        
        case 'NOTEID':
            $query .= " and recid='".$search."'";
            break;

        default:
        $arrResponse["message"] = "Search by is not valid";
            break;
    }


    $result = $conn->query($query);

    if (!$arrResponse["status"]) {
        if ($result->num_rows > 0) {
            $arrResponse["status"] = true;
            $arrResponse["data"] = $result->fetch_all(MYSQLI_ASSOC);
            $arrResponse["totalrecords"] = $result->num_rows;
        }else{
            $arrResponse["message"] = "NO records found";
        }
     }
?>