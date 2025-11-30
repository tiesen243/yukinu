import type { AppLoadContext, EntryContext } from 'react-router'
import { isbot } from 'isbot'
import { renderToReadableStream } from 'react-dom/server'
import { ServerRouter } from 'react-router'

export const streamTimeout = 5_000

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  if (request.method.toUpperCase() === 'HEAD')
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders,
    })

  let shellRendered = false
  const userAgent = request.headers.get('user-agent')

  const stream = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      onError(error: unknown) {
        responseStatusCode = 500
        if (shellRendered) console.error(error)
      },
    },
  )

  shellRendered = true

  if (isbot(userAgent)) await stream.allReady

  responseHeaders.set('Content-Type', 'text/html')

  return new Response(stream, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
