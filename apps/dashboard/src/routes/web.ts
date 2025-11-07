import { redirect } from 'react-router'

import { env } from '@yukinu/validators/env.vite'

import type { Route } from './+types/web'

export const loader = (_: Route.LoaderArgs) => {
  const protocal = env.NODE_ENV === 'production' ? 'https' : 'http'
  return redirect(`${protocal}://${env.VITE_WEB_URL}`)
}
