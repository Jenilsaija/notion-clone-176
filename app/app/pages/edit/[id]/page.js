"use client";
import React, { useContext, useEffect, useRef, useState } from 'react'
import { getCookie } from '@/lib/cokkies.lib';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import RawTool from '@editorjs/raw';
import SimpleImage from "@editorjs/simple-image";
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import LinkTool from '@editorjs/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GenralContext } from '@/Context/GeneralContext';

const page = ({ params }) => {
  let ref = React.use(params);
  ref = ref?.id?.slice(0, -3) + "=";
  const { toast } = useToast();
  const [note, setNote] = useState({});
  const [editorstate, setEditorstate] = useState(null);
  const {setTitle}=useContext(GenralContext);
  function getNoteData() {
    let ref1 = atob(ref);
    ref1 = JSON.parse(ref1);
    if (window !== undefined) {
      const objReq = {
        "action": "NOTES.LIST",
        "sanitize": {
          "searchby": "NOTEID",
          "search": ref1?.recid
        }
      }
      axios.post("/api/application", objReq, {
        headers: {
          'Content-Type': 'application/json',
          "Auth-Token": atob(getCookie("userToken"))
        }
      }).then((res) => {
        const notedata=res.data.data[0];
        if(notedata?.notedata===null){
          notedata.notedata="{}";
        }
        setNote(notedata);
      })
    }
  }

  const updateNote = async ( savedData) => {
    let ref1 = atob(ref);
    ref1 = JSON.parse(ref1);
      const objReq = {
        action: "NOTES.UPDATE",
        sanitizer: { notes_id: ref1?.recid },
        update: {
          title: note?.title,
          notedata: JSON.stringify(savedData)
        }
      }
      const res = await axios.post("/api/application", objReq, {
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

  useEffect(() => {
    getNoteData()
  }, [])

  useEffect(()=>{
    geteditor();
  },[note])

  const geteditor = () => {
    if (editorstate !== null) return; // Skip initialization if the editor already
    if (note?.notedata !== undefined && note?.notedata !== null) {
      const editorInstance = new EditorJS({
        holder: 'editorcustom',
        placeholder: 'Let`s write an awesome notes!',
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: 'Header'
            },
            levels: [3, 4, 5],
            // defaultLevel: 3,
            shortcut: 'CTRL+SHIFT+H'
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            },
          },
          linkTool: {
            class: LinkTool,
          },
          raw: {
            class: RawTool,
            placeholder: 'Enter your HTML code',
          },
          image: {
            class: SimpleImage,
            inlineToolbar: true,
          },
          embed: Embed,
          quote: {
            class: Quote,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+O',
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Quote\'s author',
            },
          },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
              maxRows: 5,
              maxCols: 5,
              withHeadings: true,
              cellPlaceholder: 'Enter something',
              headPlaceholder: 'Header',
              stretched: true,
            },
          },

        },
        data: JSON.parse(note?.notedata),
        // readOnly: readOnly,
      });
      setEditorstate(editorInstance);
  }
  }

  const handlesave = async () => {
    if (editorstate) {
      const savedData = await editorstate.save();
      updateNote(savedData);
    }
  };
  
  useEffect(()=>{
    setTitle(note.title);
  },[note])

  return (
    <div>
      <h1 className='mx-24 text-5xl my-10'> <Input placeholder="Please Enter Note Title" value={note.title} onChange={(e) => { setNote({ ...note, title: e.target.value }) }} /> </h1>
      <div id="editorcustom" ></div>
      <Button onClick={handlesave} className='mx-24 flex justify-end'> save</Button>
    </div>
  )
}

export default page
