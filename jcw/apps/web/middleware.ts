import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'es', 'fr', 'de'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};