"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenralContext } from "@/Context/GeneralContext";
import { getCookie } from "@/lib/cokkies.lib";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, {  useEffect, useState } from 'react'

function Layout({ children }) {
    const [title, setTitle] = useState("Data Fetching");
    const [category, setCategory] = useState("General");

    const Router = useRouter();
    useEffect(() => {
        async function validate() {
            const logout = await checktoken();
            if (logout) {
                Router.push("/login");
            }
        }
        validate();
    }, []);

    const checktoken = async () => {
        //code is use to validate user.
        let token = getCookie('userToken');

        const objReq = {
            "action": "VALIDATE",
            "token": atob(token)
        }

        const res = await axios.post("/api/auth", objReq);
        if (!res.data.status) {
            document.cookie.replace('userToken', '', { expires: 0 });
            return true;
        } else {
            return false;
        }
    }


    return (
        <GenralContext.Provider value={{ setTitle, setCategory }}>
            <SidebarProvider>
                <AppSidebar title={title} category={category} children={children} />
            </SidebarProvider>
        </GenralContext.Provider>
    )
}

export default Layout;