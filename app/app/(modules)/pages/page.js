"use client";
import React from 'react'
import DataTable from './commonComponents/DataTable';
import { columns } from './commonComponents/TableColumn';
import useSWR from 'swr';
import { makeRequest } from '@/lib/axios.lib';
import { LockKeyholeIcon, LockKeyholeOpen } from 'lucide-react';

const page = () => {
  async function hanldeGetPages() {
    const objReq = {
      "action": "NOTES.LIST",
      "sanitizer": {
        "searchby": "ALL",
      }
    }
    const objResponse = await makeRequest("/api/application", objReq);
    if (objResponse.status === 200 && objResponse.data.status) {
      const arrData = objResponse.data.data;
      let arrTempMenuPages = [];
      for (const key in arrData) {
        if (Object.prototype.hasOwnProperty.call(arrData, key)) {
          const item = arrData[key];
          let tempobj = {
            id: item.recid,
            note: item.title,
            Category: item.catId,
            view:"",
            lock: item.password!==null ? <LockKeyholeIcon/> :<LockKeyholeOpen/> ,
            visibility: item.visibility,
          };
          arrTempMenuPages.push(tempobj);
        }
      }
      return arrTempMenuPages;
    } else {
      toast({
        title: objResponse.data.message,
        type: "error"
      })
    }
  }

  const {data:notedata,error:err}=useSWR(["gettingNotes"],()=>hanldeGetPages(),{keepPreviousData:true});
  console.log(notedata,err,"notedata");
  
  return (
    <div>
      <DataTable columns={columns} data={notedata} />
    </div>
  )
}

export default page
