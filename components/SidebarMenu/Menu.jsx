import React, { useEffect } from 'react'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { ChartColumnStacked, File, Home, NotebookText } from 'lucide-react'
import { Separator } from '../ui/separator'
import { NavMain } from './nav-main'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { getCookie } from '@/lib/cokkies.lib'

const Menu = () => {
    const { toast } = useToast();
    const Router = useRouter();
    const [pageMenuData, setPageMenuData] = React.useState([]);
    const MenuItem = [{
        title: 'Home',
        icon: <Home />,
        href: "#"
    },
    {
        title: 'Categories',
        icon: <ChartColumnStacked />,
        href: "#"
    },
    {
        title: 'Pages',
        icon: <NotebookText />,
        href: "#"
    }]

    useEffect(() => {
        hanldeGetPages();
    }, [])

    function hanldeGetPages() {
        const objReq = {
            "action": "NOTES.LIST",
            "sanitizer":{
                "searchby":"ALL",
            }
        }
        axios.post("./api/application", objReq, {
            headers: {
                'Content-Type': 'application/json',
                "Auth-Token": atob(getCookie('userToken'))
            }
        }).then((res) => {
            if (res.data.status) {
                setPageMenuData(res.data.data.map((item) => {
                    return {
                        title: item.title,
                        icon: <File />,
                        href: "/app/pages/edit/" + btoa(JSON.stringify({recid:item.recid}))
                    }
                }))
            } else {
                toast({
                    title: res.data.message,
                    type: "error"
                })
            }
        })
    }

    function CreateNewPage() {
        const objReq = {
            "action": "NOTES.CREATE",
        }
        axios.post("./api/application", objReq, {
            headers: {
                'Content-Type': 'application/json',
                "Auth-Token": atob(getCookie("userToken"))
            }
        }).then((res) => {
            if (res.data.status) {
                toast({
                    title: res.data.message,
                    type: "success"
                })
                hanldeGetPages();
                Router.push("/app/pages/edit?ref=" + btoa(JSON.stringify({recid:res.data.recid})));
            } else {
                toast({
                    title: res.data.message,
                    type: "error"
                })
            }
        });
    }

    return (
        <>
            <SidebarGroup>
                <Separator className={"px-2 my-1"} />
                {
                    MenuItem.map((item, index) => {
                        return (
                            <SidebarMenu key={index}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton tooltip={item.title}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        )
                    })
                }
            </SidebarGroup>
            <NavMain items={pageMenuData} CreateNewPage={CreateNewPage}/>
        </>
    )
}

export default Menu
