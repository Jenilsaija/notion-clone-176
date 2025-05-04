"use client"

import { Ellipsis, PlusIcon, Trash2 } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { makeRequest } from "@/lib/axios.lib";
import { useToast } from "@/hooks/use-toast";

export function NavMain({
  items,
  CreateNewPage,
  hanldeGetPages
}) {
  const { toast } = useToast();
  
  const handleDelete = async (noteid) => {
    try {
      let arrReqParams = {
        "action": "NOTES.DELETE",
        "sanitize": {
          "notes_id": noteid
        }
      }
      const objResponse = await makeRequest("/api/application", arrReqParams);
      if (objResponse.status === 200 && objResponse.data.status) {
        toast({
          title: objResponse.data.message,
          variant: "default"
        });
        if (hanldeGetPages && typeof hanldeGetPages === 'function') {
          hanldeGetPages();
        }
      } else {
        toast({
          title: objResponse.data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    (<SidebarGroup>
      <SidebarGroupLabel>Pages</SidebarGroupLabel>
      <SidebarMenu >
        {items !== undefined && items?.map((item, index) => index < 5 && (
          <SidebarMenuItem key={item.noteid || index} className="flex justify-between w-full">
            <Link href={item.href} alt={item.title} className="w-full">
              <SidebarMenuButton tooltip={item.title} >
                {item.icon}
                <span className="text-left">{`${item?.title ? item?.title?.substring(0,20) :"" } ${item?.title?.length >= 20 ? "..." : ""}`}</span>
              </SidebarMenuButton>
            </Link>
            <DropdownMenu inset={"top"}>
              <DropdownMenuTrigger>
                <Ellipsis/>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="flex justify-between cursor-pointer" onClick={() => handleDelete(item?.noteid)}>
                  Delete <Trash2/>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={"Add Page"} onClick={CreateNewPage}>
            <PlusIcon />
            <span>Add Page</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>)
  );
}