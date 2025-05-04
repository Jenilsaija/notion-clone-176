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
import { getNoteData, protectNote, updateNote, UpdateNoteVisibility } from './commonFunc';
import useSWR from 'swr';
import PassWordModal from '@/components/PassWordModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CopyCheck, Globe, User, Users } from 'lucide-react';

const page = ({ params }) => {
  let ref = React.use(params);
  ref = ref?.id;
  
  const { toast } = useToast();
  const [editorstate, setEditorstate] = useState(null);
  const {setTitle}=useContext(GenralContext);
  const [passwordApproved, setPasswordApproved] = useState(false); 

  const {data:note, mutate:notemutate}=useSWR(["getNoteData",ref], ()=> ref !== undefined && getNoteData({ref}),{revalidateOnFocus:false,keepPreviousData:true});

  useEffect(()=>{
    if (note!==undefined) {
      geteditor();
    }
  },[note,passwordApproved])

  const geteditor = () => {
    if (editorstate !== null) return; // Skip initialization if the editor already
    if (note?.notedata !== undefined && note?.notedata !== null && passwordApproved) {
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
      updateNote({
        ref,
        savedData,
        toast,
        title:note?.title,
        notemutate
      });
    }
  };
  
  useEffect(()=>{
    setTitle(note?.title);
    if (note?.password === null) {
      setPasswordApproved(true);
    }
  },[note])

  return (
    <div>
      <div className='flex gap-2 mx-20 text-5xl my-10'>
        <h1 className='w-full'> 
          {passwordApproved && <Input placeholder="Please Enter Note Title" value={note?.title} onChange={(e) => { note.title = e.target.value }} />
          || <><Skeleton className={"w-full h-9  rounded-sm"}/></>} </h1>
        {note?.password !== undefined && <PassWordModal
          notepassword = {note?.password}
          protectNote={protectNote}
          ref={ref}
          toast={toast}
          notemutate={notemutate}
          setPasswordApproved={setPasswordApproved}
        />}
        <Select onValueChange={(value)=>{UpdateNoteVisibility({ref,visibility:value,toast,notemutate})}} value={note?.visibility}>
        <SelectTrigger className="w-[130px]">
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem  value="PV" selected><span className='flex flex-row py-auto gap-2'><User size={20}/>Private</span></SelectItem>
            <SelectItem  value="PB"><span className='flex flex-row py-auto gap-2'><Globe size={20}/>Public</span></SelectItem>
            <SelectItem  value="SH"><span className='flex flex-row py-auto gap-2'><Users size={20}/>Shared</span></SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
          {
            note?.visibility ==="PB" && 
           <Button variant="outline" size="icon" onClick={()=>{
             navigator.clipboard.writeText(window.location.origin+"/app/view/"+ref);
             toast({title:"Link Copied",variant:"default"})
             }}>
            <CopyCheck />
           </Button>
          }
      </div>
        <div id="editorcustom">{
           note !== undefined && !passwordApproved &&
          <Skeleton className={"w-full h-96 px-10 rounded-sm"}/>}</div>
          <div className='my-2'>
            {
              note !== undefined && !passwordApproved &&
              <Skeleton className={"w-24 h-9 rounded-sm"}/>
              ||
              <Button onClick={handlesave} className='mx-24 flex justify-end'>save</Button>
            }
          </div>
    </div>
  )
}

export default page
