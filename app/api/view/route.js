import db from "@/lib/db.lib";
import { NextResponse } from "next/server";

export async function POST(req) {
    let arrResponse={
        status:false,
        message:"Invalid Api Response"
    };

    const requestbody = await req.json();

    const action = requestbody.action;

    switch (action) {
        case "VIEWNOTE.VALIDATE":
            arrResponse = await viewNoteValidate(requestbody);
            break;

        case "VIEWNOTE.READ":
            arrResponse = await viewNoteRead(requestbody);
            break

        default:
            arrResponse.message="Invalid action";
            break;
    }
    return NextResponse.json(arrResponse);
}


async function viewNoteValidate(requestbody) {
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

async function viewNoteRead(requestbody) {
    let arrResponse = {
        status: false,
        message: "Invalid Api Repsonse"
    }
    const recid = requestbody['sanitize']['notes_id'];
    
    const result = await db.query("select recid as noteid,title as title,notedata as note,catId as categoryId from notes where endedat is null and recid = '?' order by recid desc;",[recid]);
    
    if (result[0].length>0) {
        arrResponse = {
            status: true,
            data: result[0][0]
        }
    }else{
        arrResponse = {
            status: false,
            message: "No Record Available"
        }
    }
    return arrResponse;
}