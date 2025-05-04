"use client";
import { Skeleton } from '@/components/ui/skeleton';
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import RawTool from '@editorjs/raw';
import SimpleImage from "@editorjs/simple-image";
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import LinkTool from '@editorjs/link';
import { getNoteData, getViewnoteValidateParams } from './CommonFunc';
import PassWordModal from '@/components/PassWordModal';
import NotFound from '@/components/NotFound';
import { Button } from '@/components/ui/button';
import { PencilIcon, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { makeRequest } from '@/lib/axios.lib';
import { toast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const page = ({ params }) => {
    let ref = React.use(params);
    ref = ref?.id;
    const router = useRouter();

    const [editorstate, setEditorstate] = useState(null);
    const [passwordApproved, setPasswordApproved] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    
    const { data: viewnotevalidateparams } = useSWR(["viewnotevalidateparams", ref], () => ref !== undefined && getViewnoteValidateParams({ ref }), { revalidateOnFocus: false, keepPreviousData: true });

    const { data: note, mutate: notemutate } = useSWR(["getNoteData", ref, viewnotevalidateparams?.visibility,passwordApproved], () => ref !== undefined && viewnotevalidateparams?.visibility !== undefined && viewnotevalidateparams?.visibility !== "PV" && passwordApproved && getNoteData({ ref }), { revalidateOnFocus: false, keepPreviousData: true });

    useEffect(() => {
        if (note !== undefined) {
            geteditor();
        }
    }, [note, isEditing])

    useEffect(()=>{
        if (viewnotevalidateparams?.password !== undefined && viewnotevalidateparams?.password === null) {
            setPasswordApproved(true);
        }
    },[viewnotevalidateparams])

    const geteditor = () => {
        if (editorstate !== null) {
            editorstate.destroy();
            setEditorstate(null);
        }
        
        if (note?.note !== undefined && note?.note !== null && passwordApproved) {
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
                data: JSON.parse(note?.note),
                readOnly: !isEditing,
            });
            setEditorstate(editorInstance);
        }
    }

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (editorstate) {
            try {
                const savedData = await editorstate.save();
                
                let noteId = null;
                if (ref) {
                    let decodedRef = atob(ref);
                    decodedRef = JSON.parse(decodedRef);
                    noteId = decodedRef?.recid;
                }
                
                if (noteId) {
                    const requestParams = {
                        action: "NOTES.UPDATE",
                        sanitizer: {
                            notes_id: noteId
                        },
                        update: {
                            title: note.title || "Untitled",
                            notedata: JSON.stringify(savedData)
                        }
                    };
                    
                    const response = await makeRequest("/api/application", requestParams);
                    
                    if (response.status === 200 && response.data.status) {
                        toast({
                            title: "Note updated successfully",
                            variant: "default",
                        });
                        setIsEditing(false);
                        notemutate();
                    } else {
                        toast({
                            title: response.data.message || "Failed to update note",
                            variant: "destructive",
                        });
                    }
                }
            } catch (error) {
                toast({
                    title: "An error occurred while saving",
                    variant: "destructive",
                });
                console.error(error);
            }
        }
    };

    const handleDelete = async () => {
        try {
            let noteId = null;
            if (ref) {
                let decodedRef = atob(ref);
                decodedRef = JSON.parse(decodedRef);
                noteId = decodedRef?.recid;
            }
            
            if (noteId) {
                const requestParams = {
                    action: "NOTES.DELETE",
                    sanitize: {
                        notes_id: noteId
                    }
                };
                
                const response = await makeRequest("/api/application", requestParams);
                
                if (response.status === 200 && response.data.status) {
                    toast({
                        title: "Note deleted successfully",
                        variant: "default",
                    });
                    router.push('/app');
                } else {
                    toast({
                        title: response.data.message || "Failed to delete note",
                        variant: "destructive",
                    });
                }
            }
        } catch (error) {
            toast({
                title: "An error occurred while deleting",
                variant: "destructive",
            });
            console.error(error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        geteditor(); // Reset editor to original state
    };

    return (
        <div className='container mx-auto'>
            <div className='w-full flex justify-between items-center my-16'>
                <h1 className='text-2xl'>
                    {!passwordApproved || note === undefined ?<Skeleton className={"w-64 h-9 rounded-sm"} /> : note?.title}
                </h1>
                
                {passwordApproved && note && (
                    <div className='flex gap-2'>
                        {isEditing ? (
                            <>
                                <Button onClick={handleSave} variant="default">Save</Button>
                                <Button onClick={handleCancel} variant="outline">Cancel</Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={handleEdit} variant="outline" size="icon">
                                    <PencilIcon className="h-4 w-4" />
                                </Button>
                                <Button onClick={() => setShowDeleteDialog(true)} variant="outline" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>
            
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

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this note?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your note.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default page
