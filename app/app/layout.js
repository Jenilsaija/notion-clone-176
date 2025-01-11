"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenralContext } from "@/Context/GeneralContext";
import { getCookie } from "@/lib/cokkies.lib";
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { SWRConfig } from "swr";

function Layout({ children }) {
  const [title, setTitle] = useState("Data Fetching");
  const [category, setCategory] = useState("General");

  const Router = useRouter();
  useEffect(() => {
    if (!getCookie('userToken')) {
      Router.push("/login");
    }
  }, []);
  return (
    <GenralContext.Provider value={{ setTitle, setCategory }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme={"system"}
        enableSystem
        disableTransitionOnChange
      >
        <Suspense fallback={<div>Loading...</div>}>
            <SidebarProvider >
              <AppSidebar title={title} category={category} children={children} />
            </SidebarProvider>
        </Suspense>
      </NextThemesProvider>
    </GenralContext.Provider>
  )
}

export default Layout;