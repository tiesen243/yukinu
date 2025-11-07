import { redirect } from 'react-router'

import { env } from '@yukinu/validators/env.vite'

import type { Route } from './+types/web'

export const loader = (_: Route.LoaderArgs) => {
  const protocol = import.meta.env.MODE === 'production' ? 'https' : 'http'
  return redirect(`${protocol}://${env.VITE_WEB_URL}`)
}
