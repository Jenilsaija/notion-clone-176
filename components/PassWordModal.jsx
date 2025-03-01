"use client";
import React, { useEffect, useState } from 'react';
import { ArrowLeft, LockKeyhole, LockKeyholeOpen } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Link from 'next/link';

const PassWordModal = (parmas) => {
    const {
        notepassword,
        protectNote,
        ref = "",
        toast,
        notemutate,
        setPasswordApproved
    } = parmas;

    const [password, setPassword] = useState(notepassword);
    const [passwordDialog, setPasswordDialog] = useState(false);
    const [cnfPassword, setCnfPassword] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (password !== null) {
            setPasswordDialog(true);
            setPasswordApproved(false);
        }
    }, [password])

    const CheckPassword = () => {
        if (password !== cnfPassword) {
            setError("Password does not match");
        } else {
            setError(null);
            setPasswordDialog(false);
            setPasswordApproved(true);
        }
    }

    const hanldeOpen=()=>{
        if(password === null) {
            setPasswordDialog(true);
        }else{
            protectNote({ ref, password:null, toast, notemutate });
        }
    }
    
    return (
        <div>
            <Dialog className="w-auto" open={passwordDialog} >
                <DialogTrigger className='flex' >
                    <Button variant="outline" size="icon" onClick={hanldeOpen}>
                        {password === null ? <LockKeyhole /> : <LockKeyholeOpen />}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    {
                        password === null ?
                            (<><DialogTitle className='flex flex-row gap-3'><span className='cursor-pointer' onClick={()=>{setPasswordDialog(false)}}><ArrowLeft size={20} /></span>Protect Your Note</DialogTitle>
                                <div className='my-1 flex w-auto gap-2'>
                                    <Input placeholder="Enter Password" type="password" className="w-full" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                                </div>
                                <DialogClose><Button title="Protect" onClick={() => { setPasswordDialog(false); protectNote({ ref, password, toast, notemutate }) }}>Protect</Button></DialogClose>
                            </>) :
                            (<>
                                <DialogHeader className='flex gap-2 w-full flex-row align-items-center'><Link className='flex gap-2' href={"/app/pages"}><ArrowLeft /></Link>
                                    <DialogTitle className='flex justify-center w-full mr-5 mb-3'>This Note is Protected</DialogTitle>
                                </DialogHeader>
                                <div className='my-1 flex w-auto gap-2'>
                                    <Input placeholder="Please Enter Password" type="password" className="w-full" value={cnfPassword} onChange={(e) => { setCnfPassword(e.target.value) }} />
                                    <Button className="flex justify-center w-fit" title="Protect" onClick={() => { CheckPassword(); }}>Show</Button>
                                </div>
                            </>)
                    }
                    {error !== null && <DialogFooter className="text-red-500 flex justify-start sm:justify-start">{error}</DialogFooter>}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PassWordModal
