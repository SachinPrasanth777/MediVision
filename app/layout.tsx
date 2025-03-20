import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MedVision AI - X-ray Analysis Dashboard",
  description:
    "Leverage privacy-compliant GAN-generated X-rays to overcome dataset limitations and enhance AI pneumonia detection accuracy.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0d1117] min-h-screen`}>{children}</body>
    </html>
  )
}

