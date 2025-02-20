import db from "@/lib/db.lib";

export const fetchAllNotes = async (requesdata) => {
    let arrResponse = {
        status: false,
        message: "Invalid Api Repsonse"
    }
    const arrSanitizeParams = requesdata['sanitize'] ? requesdata['sanitize'] : [];
    const searchby = arrSanitizeParams['searchby'] ? arrSanitizeParams['searchby'] : '';
    const search = arrSanitizeParams['search'] ? arrSanitizeParams['search'] : '';
    let query = "select * from notes where endedat is null";

    switch (searchby) {
        case 'ALL':

            break;

        case 'NOTEID':
            query += " and recid='" + search + "'";
            break;

        default:
            arrResponse["message"] = "Search by is not valid";
            break;
    }

    const result = await db.query(query);
    if (result[0].length>0) {
        arrResponse = {
            status: true,
            data: result[0]
        }
    }else{
        arrResponse = {
            status: false,
            message: "No Record Available"
        }
    }

    return arrResponse
}

export const AddNote =async ()=>{
    let arrResponse={
        status:false,
        message:"Invalid Api Response"
    }
    const res = await db.query("INSERT INTO notes (addedby,addedat) VALUES ('"+global.User.recid+"',NOW())");
    if (res[0].affectedRows>0) {
        arrResponse = {
            status:true,
            exportId:res[0].insertId,
            message:"Note Created Successfully"
        }
    }else{
        arrResponse = {
            status:false,
            message:"Something went wrong"
        }
    }
    return arrResponse;
}