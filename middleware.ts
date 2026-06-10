// middleware.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './lib/i18n'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // Match all pathnames except api, _next, and static files
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
}