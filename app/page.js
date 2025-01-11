"use client";
import { getCookie } from '@/lib/cokkies.lib';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {
    const Router = useRouter();
    useEffect(() => {
        if (!getCookie('userToken')) {
            Router.push("/login");
        } else {
            Router.push("/app/dashboard");
        }
    }, []);
    return (
        <div>
        </div>
    )
}

export default page
