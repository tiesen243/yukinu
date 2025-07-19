import { createRouteHandler } from 'uploadthing/next'

import { env } from '@yuki/validators/env'

import { ourFileRouter } from './config'

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: env.UPLOADTHING_TOKEN,
  },
})

export type { OurFileRouter } from './config'
