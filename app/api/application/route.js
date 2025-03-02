import { NextResponse } from "next/server";
import { AddNote, DeleteNote, fetchAllNotes, ProtectNote, UpdateNote, UpdateNoteVisibility, viewNoteValidate } from "./Notes/NoteFunctions";
import { validateToken } from "./validation";

export async function POST(req) {
    let arrResponse={
        status:false,
        message:"Invalid Api Response"
    };
    const requestbody = await req.json();
    const token = req.headers.get("Auth-Token");
    if (token === undefined) {
        arrResponse.message = "Token Should not be empty";
        return NextResponse.json(arrResponse);
    }else{
        const User = await validateToken(token);
        if (!User) {
            arrResponse.message = "Invalid Token";
            arrResponse.logout = true;
            return NextResponse.json(arrResponse);
        }else{
            global.User = User;
        }
    }

    const action = requestbody.action;
    
    switch (action) {
        case "NOTES.LIST":
            arrResponse = await fetchAllNotes(requestbody);
            break;

        case 'NOTES.CREATE':
            arrResponse = await AddNote();
        break;
    
        case "NOTES.UPDATE":
            arrResponse = await UpdateNote(requestbody);
            break;

        case "NOTES.DELETE":
            arrResponse = await DeleteNote(requestbody);
            break;

        case "NOTES.PROTECT":
            arrResponse = await ProtectNote(requestbody);
            break;

        case "NOTEVISIBILITY.UPDATE":
            arrResponse = await UpdateNoteVisibility(requestbody);
            break;

        case "VIEWNOTE.VALIDATE":
            arrResponse = await viewNoteValidate(requestbody);
            break;

        default:
            arrResponse.message="Invalid action";
            break;
    }

    return NextResponse.json(arrResponse)
}