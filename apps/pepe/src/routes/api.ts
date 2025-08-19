import type { Route } from '@react-router/types/api'

export const loader = (_: Route.LoaderArgs) => ({
  message: 'ok',
})
