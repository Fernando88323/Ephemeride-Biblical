/* import { Analytics } from '@vercel/analytics/next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Efeméride Bíblica',
  description: 'Una efeméride bíblica diferente cada día',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport = {
  colorScheme: 'dark',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a1023' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} antialiased bg-terminal-dark text-terminal-green`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
 */
import { Analytics } from "@vercel/analytics/next";
import { Lora } from "next/font/google";
import "./globals.css";

const lora = Lora({ subsets: ["latin"], variable: "--font-serif" });

export const metadata = {
  title: "Efeméride Bíblica",
  description: "Una efeméride bíblica diferente cada día",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport = {
  colorScheme: "light",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#fafbff" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={lora.variable} suppressHydrationWarning>
      <body
        className="antialiased bg-background text-foreground"
        suppressHydrationWarning
      >
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
