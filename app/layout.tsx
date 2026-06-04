import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { EditModeProvider } from "@/providers/EditModeProvider"
import { EditModeToggle } from "@/components/ui/edit-mode-toggle"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <EditModeProvider>
          <ThemeProvider>{children}</ThemeProvider>
          <EditModeToggle />
        </EditModeProvider>
      </body>
    </html>
  )
}
