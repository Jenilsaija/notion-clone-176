import db from "@/lib/db.lib";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function POST(req) {
    let arrRepsponse = {
        "status": false,
        "message": "Invald API Request"
    }
    const requesdata = await req.json();
    const action = requesdata.action;
    const seckey = "TLS_NOTE_00123_PASS_@_TOKEN_Key"

    switch (action) {
        case "LOGIN":
            const res = await db.query("SELECT * FROM users WHERE email='" + requesdata['email'] + "' AND password='" + requesdata['password'] + "'");
            const token = jwt.sign({ data: res[0][0], exp: Math.floor(Date.now() / 1000) + (60 * 60) }, seckey);
            arrRepsponse = {
                status: true,
                data: {
                    userToken: token
                }
            }
            break;

        case "MAKE":
            let objres = await db.query("SELECT * FROM users WHERE email='" + requesdata['email'] + "'");
            if (objres[0].length === 0) {
                objres = await db.query("INSERT INTO users (email, password) VALUES ('" + requesdata['email'] + "', '" + requesdata['password'] + "')");
                if (objres[0].affectedRows > 0) {
                    arrRepsponse.message = "User Created SuccessFully"
                } else {
                    arrRepsponse.message = "Something went Wrong"
                }
            } else {
                arrRepsponse.message = "Email Address Alredy Exists"
            }
            break;

        default:
            arrRepsponse.message = "Invalid Action";
            break;
    }

    return NextResponse.json(arrRepsponse);
}