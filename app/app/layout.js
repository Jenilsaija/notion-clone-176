"use client";
import Loader from "@/components/Loader";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { Suspense} from 'react'

function Layout({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <Suspense fallback={<Loader/>}>
          {children}
        </Suspense>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default Layout;