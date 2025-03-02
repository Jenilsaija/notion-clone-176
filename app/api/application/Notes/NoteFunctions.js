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

    const result = await db.query(query + " order by recid desc;");
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

export const UpdateNote = async (requestbody)=>{
    let arrResponse={
        status:false,
        message:"Invalid Api Response"
    }
    const recid = requestbody['sanitizer']['notes_id'];
    const updateparams = requestbody['update'];
    const res = await db.query("UPDATE notes SET title=?,notedata=?,modifiedat=NOW() WHERE recid='"+recid+"'",[updateparams['title'],updateparams['notedata']]);
    if (res[0].affectedRows>0) {
        arrResponse = {
            status:true,
            message:"Note Updated Successfully"
        }
    }else{
        arrResponse = {
            status:false,
            message:"Something went wrong"
        }
    }
    return arrResponse;
}

export const DeleteNote = async (requestbody)=>{
    let arrResponse={
        status:false,
        message:"Invalid Api Response"
    }
    const recid = requestbody['sanitize']['notes_id'];
    const res = await db.query("UPDATE notes SET endedat=NOW() WHERE recid='"+recid+"'");
    if (res[0].affectedRows>0) {
        arrResponse = {
            status:true,
            message:"Note Deleted Successfully"
        }
    }else{
        arrResponse = {
            status:false,
            message:"Something went wrong"
        }
    }
    return arrResponse;
}

export const ProtectNote = async (requestbody)=>{
    let arrResponse={
        status:false,
        message:"Invalid Api Response"
    }
    const recid = requestbody['sanitize']['notes_id'];
    const password = requestbody['update']['password'];
    const res = await db.query("UPDATE notes SET password=? WHERE recid='"+recid+"'",[password]);
    if (res[0].affectedRows>0) {
        arrResponse = {
            status:true,
            message:password === null ?"Note UnProtected Successfully":"Note Protected Successfully"
        }
    }else{
        arrResponse = {
            status:false,
            message:"Something went wrong"
        }
    }
    return arrResponse;
}

export const UpdateNoteVisibility = async (requestbody)=>{
    let arrResponse={
        status:false,
        message:"Invalid Api Response"
    }
    const recid = requestbody['sanitize']['notes_id'];
    const visibility = requestbody['update']['visibility'];
    const res = await db.query("UPDATE notes SET visibility=? WHERE recid='"+recid+"'",[visibility]);
    if (res[0].affectedRows>0) {
        arrResponse = {
            status:true,
            message:"Note Visibility Updated Successfully"
        }
    }else{
        arrResponse = {
            status:false,
            message:"Something went wrong"
        }
    }
    return arrResponse;
}

export async function viewNoteValidate(requestbody) {
    let arrResponse = {
        status: false,
        message: "Invalid Api Repsonse"
    }
    const recid = requestbody['sanitize']['notes_id'];
    const result = await db.query("select visibility,password from notes where recid='"+recid+"'");
    
    if (result[0].length>0) {
        arrResponse = {
            status: true,
            data:{
                visibility: result[0][0].visibility,
                password: result[0][0].password
            },
        }
    }else{
        arrResponse = {
            status: false,
            message: "No Record Available"
        }
    }
    return arrResponse;
}