"use client";
import React, { useEffect } from 'react'
import dynamic from "next/dynamic";
import { useSearchParams } from 'next/navigation';
import { getCookie } from '@/lib/cokkies.lib';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import useSWR from 'swr';
const TextArea = dynamic(() => import("@/components/text-area"), { ssr: false })

const page = () => {
  const searParams = useSearchParams();
  const { toast } = useToast();
  const ref = searParams.get("ref");

  function getNoteData(ref2) {
    let ref1 = atob(ref2.ref);
    ref1 = JSON.parse(ref1);

    if (window !== undefined) {
      const objReq = {
        "action": "NOTES.LIST",
        "sanitize": {
          "searchby": "NOTEID",
          "search": ref1?.recid
        }
      }
      axios.post("https://" + window.location.host + "/api/application.php", objReq, {
        headers: {
          'Content-Type': 'application/json',
          "Auth-Token": atob(getCookie("userToken"))
        }
      }).then((res) => {
        return res.data.data[0]
      })
    }
  }

  const updateNote = async (heading, savedData) => {
    let ref1 = atob(ref);
    ref1 = JSON.parse(ref1);
    const objReq = {
      action: "NOTES.UPDATE",
      sanitizer: { notes_id: ref1?.recid },
      update: {
        title: heading,
        notedata: JSON.stringify(savedData)
      }
    }
    const res = await axios.post("https://" + window.location.host + "/api/application.php", objReq, {
      headers: {
        'Content-Type': 'application/json',
        "Auth-Token": atob(getCookie("userToken"))
      }
    })
    if (res.data.status) {
      toast({
        title: res.data.message,
        type: "success"
      })
    } else {
      toast({
        title: res.data.message,
        type: "error"
      })
    }
  }


  const { data: note,isLoading:isLoading ,error: error } = useSWR("notefatching", getNoteData({ ref }), { keepPreviousData: false });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      <TextArea title={note?.title !== undefined ? note?.title : ""} notedata={note?.notedata !== undefined ? JSON.parse(note?.notedata) : {}} updateNote={updateNote} />
    </div>
  )
}

export default page
