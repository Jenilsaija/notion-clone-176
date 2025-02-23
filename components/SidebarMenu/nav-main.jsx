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

export function NavMain({
  items,
  CreateNewPage
}) {
  return (
    (<SidebarGroup>
      <SidebarGroupLabel>Pages</SidebarGroupLabel>
      <SidebarMenu >
        {items.map((item, index) => index < 5 && (
          <>
            <SidebarMenuItem key={index}  className="flex justify-between w-full">
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
                  <DropdownMenuItem className="flex justify-between cursor-pointer" onClick={handledelete(item?.noteid)}>Delete <Trash2/></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </>
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

function handledelete(noteid) {
  //wrtie delete function
}