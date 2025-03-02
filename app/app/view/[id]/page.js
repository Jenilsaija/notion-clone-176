"use client";
import { Skeleton } from '@/components/ui/skeleton';
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import { getNoteData } from '../../(modules)/pages/edit/[id]/commonFunc';
import RawTool from '@editorjs/raw';
import SimpleImage from "@editorjs/simple-image";
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import LinkTool from '@editorjs/link';
import {  getViewnoteValidateParams } from './CommonFunc';
import PassWordModal from '@/components/PassWordModal';
import NotFound from '@/components/NotFound';

const page = ({ params }) => {
    let ref = React.use(params);
    ref = ref?.id;

    const [editorstate, setEditorstate] = useState(null);
    const [passwordApproved, setPasswordApproved] = useState(false); 
    const { data: viewnotevalidateparams } = useSWR(["viewnotevalidateparams", ref], () => ref !== undefined && getViewnoteValidateParams({ ref }), { revalidateOnFocus: false, keepPreviousData: true });
    
    const { data: note, mutate: notemutate } = useSWR(["getNoteData", ref, viewnotevalidateparams?.visibility,passwordApproved], () => ref !== undefined && viewnotevalidateparams?.visibility !== undefined && viewnotevalidateparams?.visibility !== "PV" && passwordApproved && getNoteData({ ref }), { revalidateOnFocus: false, keepPreviousData: true });

    useEffect(() => {
        if (note !== undefined) {
            geteditor();
        }
    }, [note])

    useEffect(()=>{
        if (viewnotevalidateparams?.password !== undefined && viewnotevalidateparams?.password === null) {
            setPasswordApproved(true);
        }
    },[viewnotevalidateparams])

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
                readOnly: true,
            });
            setEditorstate(editorInstance);
        }
    }

    return (
        <div className='container mx-auto'>
            <h1 className='w-full flex justify-center my-16 text-2xl'>
                {!passwordApproved || note === undefined ?<Skeleton className={"w-full h-9  rounded-sm"} /> : note?.title}</h1>
            <div id="editorcustom">
                {
                    !passwordApproved || note === undefined ?
                    <Skeleton className={"w-full h-96 px-10 rounded-sm mx-auto"} />:<></>
                }
            </div>


            {viewnotevalidateparams?.password !== undefined && viewnotevalidateparams?.password !== null && <PassWordModal
                notepassword={viewnotevalidateparams?.password}
                ref={ref}
                setPasswordApproved={setPasswordApproved}
            />
            }
            {
                (viewnotevalidateparams?.visibility !== undefined && viewnotevalidateparams?.visibility === "PV") &&
                <>
                    <NotFound/>
                </>
            }
        </div>
    )
}

export default page
