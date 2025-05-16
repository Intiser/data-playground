import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { DataStoreProvider } from "@/lib/data-store"
import { ChartStoreProvider } from "@/lib/chart-store"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DataPlayground - Client-Side Data Visualization",
  description: "Visualize your data intuitively — without storing anything on a server.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <DataStoreProvider>
            <ChartStoreProvider>
              {children}
              <Toaster />
            </ChartStoreProvider>
          </DataStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
