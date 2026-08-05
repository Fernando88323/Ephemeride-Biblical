import { Analytics } from '@vercel/analytics/next'
import { Lora } from 'next/font/google'
import './globals.css'

const lora = Lora({ subsets: ['latin'], variable: '--font-serif' })

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
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`dark ${lora.variable}`}>
      <body className="antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
