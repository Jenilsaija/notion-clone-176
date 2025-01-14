import db from "@/lib/db.lib";
import { NextResponse } from "next/server";
import { fetchAllNotes } from "./Notes/NoteFunctions";

export async function POST(req) {
    let arrResponse={
        status:false,
        message:"Invalid Api Response"
    };
    const requestbody = await req.json();
    const action = requestbody.action;
    
    switch (action) {
        case "NOTES.LIST":
            arrResponse = await fetchAllNotes(requestbody);
            break;
    
        default:
            arrResponse.message="Invalid action";
            break;
    }

    return NextResponse.json(arrResponse)
}