"use client";
import Loader from "@/components/Loader";
import { ThemeProvider as NextThemesProvider } from "next-themes"
import React, { Suspense} from 'react'

function Layout({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={"system"}
      enableSystem
      disableTransitionOnChange
    >
      <Suspense fallback={<Loader/>}>
        {children}
      </Suspense>
    </NextThemesProvider>
  )
}

export default Layout;