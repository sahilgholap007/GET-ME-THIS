import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import localFont from "next/font/local"
import LayoutWrapper from "./LayoutWrapper" // 👈 import the new wrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const monumentFont = localFont({
  src: [
    {
      path: "../app/fonts/Monument Extended Ultralight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../app/fonts/MonumentExtended-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/MonumentExtended-Ultrabold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-monument",
  display: "swap",
  preload: true,
})

const sfProDisplayFont = localFont({
  src: [
    {
      path: "../app/fonts/SFPRODISPLAYTHINITALIC.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../app/fonts/SFPRODISPLAYREGULAR.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/SFPRODISPLAYMEDIUM.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../app/fonts/SFPRODISPLAYBOLD.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro-display",
  display: "swap",
  preload: true,
})

export const metadata = {
  title: "GetMeThis - Anything from anywhere in the world",
  description: "Powered by theglobalgenie",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${monumentFont.variable} ${sfProDisplayFont.variable} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
