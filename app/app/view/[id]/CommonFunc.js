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
    
    const res = await makeRequest("/api/view", objReq);
    
    if (res && res.status === 200 && res.data.status) {
        return res.data.data;
    }
    return null;
}

export async function getNoteData(params) {
    const {
        ref,
    } = params;
    try {
        let ref1 = atob(ref);
        ref1 = JSON.parse(ref1);
        const objReq = {
            "action": "VIEWNOTE.READ",
            "sanitize": {
                "notes_id": ref1?.recid
            }
        }
        
        const objResponse = await makeRequest("/api/view", objReq);

        if (objResponse && objResponse.status === 200 && objResponse.data.status) {
            let arrnotesdata = objResponse.data.data;
            if (arrnotesdata?.note === null) {
                arrnotesdata.note = "{}"
            }
            return arrnotesdata
        }
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}