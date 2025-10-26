import '../globals.css'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import Navigation from '@/components/navigation/Navigation'
import AIAssistant from '@/components/ai-assistant/AIAssistant'

export const metadata: Metadata = {
  title: 'Just Code Works',
  description: 'Build beautiful websites with ease',
}

type Props = {
  children: React.ReactNode;
  params: {locale: string};
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params: {locale}
}: Props) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-gray-50">
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  )
}