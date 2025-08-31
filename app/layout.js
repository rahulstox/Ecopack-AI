// File: app/layout.js
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import Providers from '@/components/Providers' // Import the new provider

export const metadata = {
  title: 'Ecopack AI - Sustainable Packaging Recommendations',
  description: 'Instant, eco-smart packaging picks for every SKU',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={GeistSans.className}>
      <body>
        <Providers>{children}</Providers>{' '}
        {/* Wrap your children with the provider */}
      </body>
    </html>
  )
}
