import { makeRequest } from "@/lib/axios.lib";

export const getViewnoteValidateParams = async (params) => { 
    const {
        ref
    } = params;
    let ref1 = atob(ref);
    ref1 = JSON.parse(ref1);
    const objReq = {
        action: "VIEWNOTE.VALIDATE",
        sanitize: { notes_id: ref1?.recid }
    }
    const res = await makeRequest("/api/application", objReq);
    if (res.data.status) {
        return res.data.data;
    }
    return null;
}