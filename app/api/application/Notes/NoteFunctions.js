import db from "@/lib/db.lib";

export const fetchAllNotes = async (requesdata) => {
    let arrResponse = {
        status: false,
        message: "Invalid Api Repsonse"
    }
    // Check for both sanitize and sanitizer parameters to ensure compatibility
    const arrSanitizeParams = requesdata['sanitize'] || requesdata['sanitizer'] || {};
    const searchby = arrSanitizeParams['searchby'] ? arrSanitizeParams['searchby'] : 'ALL';
    const search = arrSanitizeParams['search'] ? arrSanitizeParams['search'] : '';
    // Get pagination parameters
    const page = arrSanitizeParams['page'] ? parseInt(arrSanitizeParams['page']) : 1;
    const pageSize = arrSanitizeParams['pageSize'] ? parseInt(arrSanitizeParams['pageSize']) : 10;
    const offset = (page - 1) * pageSize;
    
    // Always filter by current user
    let query = "select * from notes where endedat is null AND addedby = ?";
    const queryParams = [global.User.recid];

    switch (searchby) {
        case 'ALL':
            break;

        case 'NOTEID':
            query += " and recid = ?";
            queryParams.push(search);
            break;

        default:
            arrResponse["message"] = "Search by is not valid";
            return arrResponse;
    }

    // Get total count for pagination
    const countResult = await db.query("SELECT COUNT(*) as total FROM notes WHERE endedat is null AND addedby = ?", [global.User.recid]);
    const totalCount = countResult[0][0].total;
    const totalPages = Math.ceil(totalCount / pageSize);

    // Add pagination to query
    query += " order by recid desc LIMIT ? OFFSET ?";
    queryParams.push(pageSize, offset);

    const result = await db.query(query, queryParams);
    if (result[0].length > 0) {
        arrResponse = {
            status: true,
            data: result[0],
            pagination: {
                page,
                pageSize,
                totalCount,
                totalPages
            }
        }
    } else {
        arrResponse = {
            status: true,
            data: [],
            pagination: {
                page,
                pageSize,
                totalCount: 0,
                totalPages: 0
            },
            message: "No records available"
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
    // Handle both sanitize and sanitizer parameters
    const sanitizeParams = requestbody['sanitize'] || requestbody['sanitizer'] || {};
    const recid = sanitizeParams['notes_id'];
    const updateparams = requestbody['update'];
    
    if (!recid) {
        arrResponse.message = "Note ID is required";
        return arrResponse;
    }
    
    // First check if the note belongs to the current user
    const checkOwnership = await db.query("SELECT addedby FROM notes WHERE recid = ? AND endedat IS NULL", [recid]);
    
    if (checkOwnership[0].length === 0) {
        arrResponse.message = "Note not found";
        return arrResponse;
    }
    
    if (checkOwnership[0][0].addedby !== global.User.recid) {
        arrResponse.message = "You don't have permission to update this note";
        return arrResponse;
    }
    
    const res = await db.query("UPDATE notes SET title=?,notedata=?,modifiedat=NOW() WHERE recid=? AND addedby=?",
        [updateparams['title'], updateparams['notedata'], recid, global.User.recid]);
    
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
    // Handle both sanitize and sanitizer parameters
    const sanitizeParams = requestbody['sanitize'] || requestbody['sanitizer'] || {};
    const recid = sanitizeParams['notes_id'];
    
    if (!recid) {
        arrResponse.message = "Note ID is required";
        return arrResponse;
    }
    
    // First check if the note belongs to the current user
    const checkOwnership = await db.query("SELECT addedby FROM notes WHERE recid = ? AND endedat IS NULL", [recid]);
    
    if (checkOwnership[0].length === 0) {
        arrResponse.message = "Note not found";
        return arrResponse;
    }
    
    if (checkOwnership[0][0].addedby !== global.User.recid) {
        arrResponse.message = "You don't have permission to delete this note";
        return arrResponse;
    }
    
    const res = await db.query("UPDATE notes SET endedat=NOW() WHERE recid=? AND addedby=?", [recid, global.User.recid]);
    
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
    // Handle both sanitize and sanitizer parameters
    const sanitizeParams = requestbody['sanitize'] || requestbody['sanitizer'] || {};
    const recid = sanitizeParams['notes_id'];
    const password = requestbody['update']['password'];
    
    if (!recid) {
        arrResponse.message = "Note ID is required";
        return arrResponse;
    }
    
    // First check if the note belongs to the current user
    const checkOwnership = await db.query("SELECT addedby FROM notes WHERE recid = ? AND endedat IS NULL", [recid]);
    
    if (checkOwnership[0].length === 0) {
        arrResponse.message = "Note not found";
        return arrResponse;
    }
    
    if (checkOwnership[0][0].addedby !== global.User.recid) {
        arrResponse.message = "You don't have permission to protect this note";
        return arrResponse;
    }
    
    const res = await db.query("UPDATE notes SET password=? WHERE recid=? AND addedby=?", [password, recid, global.User.recid]);
    
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
    // Handle both sanitize and sanitizer parameters
    const sanitizeParams = requestbody['sanitize'] || requestbody['sanitizer'] || {};
    const recid = sanitizeParams['notes_id'];
    const visibility = requestbody['update']['visibility'];
    
    if (!recid) {
        arrResponse.message = "Note ID is required";
        return arrResponse;
    }
    
    // First check if the note belongs to the current user
    const checkOwnership = await db.query("SELECT addedby FROM notes WHERE recid = ? AND endedat IS NULL", [recid]);
    
    if (checkOwnership[0].length === 0) {
        arrResponse.message = "Note not found";
        return arrResponse;
    }
    
    if (checkOwnership[0][0].addedby !== global.User.recid) {
        arrResponse.message = "You don't have permission to change visibility of this note";
        return arrResponse;
    }
    
    const res = await db.query("UPDATE notes SET visibility=? WHERE recid=? AND addedby=?", [visibility, recid, global.User.recid]);
    
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

