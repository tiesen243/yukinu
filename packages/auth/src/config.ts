import { env } from '@yukinu/validators/env'

import type { AuthConfig } from '@/core/types'

import { adapter } from '@/adapter'
import { Github } from '@/core/providers/github'
import { Google } from '@/core/providers/google'

export const authOptions = {
  secret: env.AUTH_SECRET ?? 'secret',

  adapter,

  providers: [
    new Github(env.AUTH_GITHUB_ID, env.AUTH_GITHUB_SECRET),
    new Google(env.AUTH_GOOGLE_ID, env.AUTH_GOOGLE_SECRET),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    expiresThreshold: 60 * 60 * 24, // 1 day
    accessTokenExpiresIn: 60 * 15, // 15 minutes
  },

  cookies: {
    keys: {
      accessToken: 'auth.access_token',
      refreshToken: 'auth.refresh_token',
      state: 'auth.state',
      codeVerifier: 'auth.code',
      redirectUri: 'auth.redirect_uri',
    },

    options: {
      Path: '/',
      HttpOnly: true,
      Secure: env.NODE_ENV === 'production',
      SameSite: 'Lax',
    },
  },
} as const satisfies AuthConfig
