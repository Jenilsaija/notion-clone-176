import { NextResponse } from "next/server";
import { AddNote, fetchAllNotes, UpdateNote } from "./Notes/NoteFunctions";
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
        default:
            arrResponse.message="Invalid action";
            break;
    }

    return NextResponse.json(arrResponse)
}