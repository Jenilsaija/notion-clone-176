import { makeRequest } from "@/lib/axios.lib";

export async function getNoteData(params) {
    const {
        ref,
    } = params;
    try {
        let ref1 = atob(ref);
        ref1 = JSON.parse(ref1);
        const objReq = {
            "action": "NOTES.LIST",
            "sanitize": {
                "searchby": "NOTEID",
                "search": ref1?.recid
            }
        }
        const objResponse = await makeRequest("/api/application",objReq);

        if (objResponse?.status === 200 && objResponse?.data?.status) {
            let arrnotesdata = objResponse.data.data[0];
            if (arrnotesdata?.notedata === null) {
                arrnotesdata.notedata = "{}"
            }
            return arrnotesdata
        }
        return null;
    } catch (error) {
        console.log(error);
    }

}

export const updateNote = async (params) => {
    const {
        ref,
        savedData,
        toast,
        title,
        notemutate
    } = params;
    
    let ref1 = atob(ref);
    ref1 = JSON.parse(ref1);

    const objReq = {
        action: "NOTES.UPDATE",
        sanitizer: { notes_id: ref1?.recid },
        update: {
            title: title,
            notedata: JSON.stringify(savedData)
        }
    }
    const res = await makeRequest("/api/application", objReq);

    if (res.data.status) {
        toast({
            title: res.data.message,
            type: "success"
        })
        notemutate();
    } else {
        toast({
            title: res.data.message,
            type: "error"
        })
    }
    return null;
}