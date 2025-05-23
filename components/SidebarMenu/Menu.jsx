"use client"

import React, { useEffect } from 'react'
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { ChartColumnStacked, File, Home, NotebookText } from 'lucide-react'
import { Separator } from '../ui/separator'
import { NavMain } from './nav-main'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { makeRequest } from '@/lib/axios.lib'
import useSWR from 'swr'

const Menu = () => {
    const { toast } = useToast();
    const Router = useRouter();
    const MenuItem = [{
        title: 'Home',
        icon: <Home />,
        href: "/app/dashboard"
    },
    {
        title: 'Categories',
        icon: <ChartColumnStacked />,
        href: "#"
    },
    {
        title: 'Pages',
        icon: <NotebookText />,
        href: "/app/pages"
    }];

    async function hanldeGetPages() {
        const objReq = {
            "action": "NOTES.LIST",
            "sanitize": {
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
                        title: item.title,
                        icon: <File />,
                        href: "/app/pages/edit/" + btoa(JSON.stringify({ recid: item.recid })),
                        noteid: item.recid
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

    async function CreateNewPage() {
        const objReq = {
            "action": "NOTES.CREATE",
        }
        const objResponse = await makeRequest("/api/application", objReq);
        if (objResponse.status === 200 && objResponse?.data?.status) {
            toast({
                title: objResponse.data.message,
                variant: "default"
            });
            hanldeGetPages();
            Router.push("/app/pages/edit/" + btoa(JSON.stringify({ recid: objResponse.data.exportId })));
        } else {
            toast({
                title: objResponse.data.message,
                variant: "destructive"
            });
        }
    }

    const { data: pageMenuData, isLoading: pagemenuisloding, mutate } = useSWR(["getMenuPages"], () => hanldeGetPages(), { keepPreviousData: true, revalidateOnFocus: true });

    return (
        <>
            <SidebarGroup>
                <Separator className={"px-2 my-1"} />
                {
                    MenuItem.map((item, index) => {
                        return (
                            <SidebarMenu key={index}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton tooltip={item.title} onClick={()=>Router.push(item.href)}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        )
                    })
                }
            </SidebarGroup>
            <NavMain items={pageMenuData} CreateNewPage={CreateNewPage} hanldeGetPages={() => mutate()} />
        </>
    )
}

export default Menu
