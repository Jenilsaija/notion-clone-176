import axios from "axios";
import { getCookie } from "./cokkies.lib";

export async function makeRequest(url, arrReqParams) {
    try {
        const token = getCookie('userToken');

        const arrReqheaders = {
            headers: {
                'Content-Type': 'application/json',
                "Auth-Token": atob(token)
            }
        }
        const arrResponse = await axios.post(url, arrReqParams, arrReqheaders);
        return arrResponse;
    } catch (error) {
        console.error(error);
        console.log(error, "error");
        return undefined;
    }
}