"use client";
import React from 'react'
import DataTable from './commonComponents/DataTable';
import { columns } from './commonComponents/TableColumn';
import useSWR from 'swr';
import { makeRequest } from '@/lib/axios.lib';
import { Eye, LockKeyholeIcon, LockKeyholeOpen, PencilIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
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

const page = () => {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedNoteId, setSelectedNoteId] = React.useState(null);

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
            view: item.visibility === "PB" ? (
              <Link href={`/app/view/${btoa(JSON.stringify({recid: item.recid}))}`}>
                <Button variant="outline" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            ) : "",
            lock: item.password!==null ? <LockKeyholeIcon/> :<LockKeyholeOpen/> ,
            visibility: item.visibility,
            edit: (
              <Link href={`/app/pages/edit/${btoa(JSON.stringify({recid: item.recid}))}`}>
                <Button variant="outline" size="icon">
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </Link>
            ),
            delete: (
              <Button 
                variant="outline" 
                size="icon" 
                className="text-destructive hover:bg-destructive/10"
                onClick={() => handleDeleteClick(item.recid)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ),
          };
          arrTempMenuPages.push(tempobj);
        }
      }
      return arrTempMenuPages;
    } else {
      toast({
        title: objResponse.data.message,
        variant: "destructive"
      });
    }
  }

  const {data:notedata, error:err, mutate:noteMutate} = useSWR(["gettingNotes"], () => hanldeGetPages(), {keepPreviousData:true});
  
  const handleDeleteClick = (noteId) => {
    setSelectedNoteId(noteId);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      if (selectedNoteId) {
        const requestParams = {
          action: "NOTES.DELETE",
          sanitize: {
            notes_id: selectedNoteId
          }
        };
        
        const response = await makeRequest("/api/application", requestParams);
        
        if (response.status === 200 && response.data.status) {
          toast({
            title: "Note deleted successfully",
            variant: "default",
          });
          setShowDeleteDialog(false);
          noteMutate(); // Refresh the list
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

  return (
    <div>
      <DataTable columns={columns} data={notedata} />

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

