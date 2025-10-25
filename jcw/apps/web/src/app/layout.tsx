import './globals.css'
import type { Metadata } from 'next'

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
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Just Code Works</h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
                <a href="/build" className="text-gray-600 hover:text-gray-900">Build</a>
                <a href="/dashboard/admin" className="text-gray-600 hover:text-gray-900">Admin</a>
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-400">
              © 2024 Just Code Works. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}