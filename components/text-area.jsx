"use client";
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import LinkTool from '@editorjs/link';
import { useEffect, useRef, useState } from 'react';
import RawTool from '@editorjs/raw';
import SimpleImage from "@editorjs/simple-image";
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function TextArea(params) {
    const {
        readOnly = false,
        title = "",
        notedata = {},
        updateNote
    } = params;


    const editorInstance = useRef(null); // Use a ref to store the editor instance
    useEffect(() => {
        if (editorInstance.current) return; // Skip initialization if the editor already
        editorInstance.current = new EditorJS({
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
            data: notedata,
            readOnly: readOnly,
        });

        return () => {
            if (editorInstance.current && typeof editorInstance.current.destroy === 'function') {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        }; // Cleanup on unmount
    }, []);

    const [heading, setHeading] = useState(title);

    const handlesave = async () => {
        if (editorInstance.current) {
            const savedData = await editorInstance.current.save();
            updateNote(heading, savedData);
        }
    };


    return (
        <>
            <h1 className='mx-24 text-5xl my-10'> <Input placeholder="Please Enter Note Title" value={heading} onChange={(e) => { setHeading(e.target.value) }} /> </h1>
            <div id="editorcustom" ></div>
            <Button onClick={handlesave} className='mx-24 flex justify-end'> save</Button>
        </>
    );
}