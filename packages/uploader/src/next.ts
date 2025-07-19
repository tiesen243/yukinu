import { extractRouterConfig } from 'uploadthing/server'

import { ourFileRouter } from './config'

export { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
export const routerConfig = extractRouterConfig(ourFileRouter)
