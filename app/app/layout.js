"use client";
import Loader from "@/components/Loader";
import { ThemeProvider } from "@/components/theme-provider";
import React, { Suspense} from 'react'

function Layout({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Suspense fallback={<Loader/>}>
        {children}
      </Suspense>
    </ThemeProvider>
  )
}

export default Layout;