"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...params
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [props,setProps] = React.useState({});
  React.useEffect(() => { setProps(params) }, [props.defaultTheme])
  
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
