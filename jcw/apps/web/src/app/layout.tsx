import './globals.css'
import type { Metadata } from 'next'
import Navigation from '@/components/navigation/Navigation'
import AIAssistant from '@/components/ai-assistant/AIAssistant'

export const metadata: Metadata = {
  title: 'Just Code Works',
  description: 'Build beautiful websites with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Navigation />
        <main>{children}</main>
        <footer className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-400">
              © 2024 Just Code Works. All rights reserved.
            </p>
          </div>
        </footer>
        <AIAssistant />
      </body>
    </html>
  )
}