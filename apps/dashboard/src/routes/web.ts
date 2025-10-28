import { redirect } from 'react-router'

import { env } from '@yukinu/validators/env'

import type { Route } from './+types/web'

export const loader = (_: Route.LoaderArgs) => {
  if (env.NODE_ENV === 'development')
    return redirect(`http://${env.NEXT_PUBLIC_WEB_URL}`)
  return redirect(`https://${env.NEXT_PUBLIC_WEB_URL}`)
}
