import type { NextRequest } from 'next/server'

import { handler } from '@yukinu/api'

export const GET = (request: NextRequest) => handler(request)
export const POST = (request: NextRequest) => handler(request)
export const OPTIONS = (request: NextRequest) => handler(request)
