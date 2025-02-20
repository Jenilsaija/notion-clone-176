import jwt from "jsonwebtoken";

const seckey = "TLS_NOTE_00123_PASS_@_TOKEN_Key"
export function validateToken(token) {
    try {
        const decoded =  jwt.verify(token, seckey);
        return decoded.data;
    } catch (error) {
        return null;
    }
}