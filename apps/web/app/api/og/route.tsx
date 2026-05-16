import type { NextRequest } from 'next/server'

import { OpenGraph } from '@yukinu/ui/open-graph'
import { ImageResponse } from 'next/og'

import { env } from '@/lib/env'

export const GET = async (req: NextRequest, _: RouteContext<'/api/og'>) => {
  const url = new URL(req.url)
  const { searchParams } = url

  const title = searchParams.get('title') ?? ''
  const description = searchParams.get('description') ?? ''
  let image = searchParams.get('image') ?? ''
  if (image && !image.startsWith('http'))
    image = new URL(image, req.url).toString()

  const fontData = await loadGoogleFont('Geist')
  const logoUrl = new URL('/icon-512.png', req.url).toString()

  return new ImageResponse(
    <OpenGraph
      appName={env.NEXT_PUBLIC_APP_NAME}
      title={title}
      description={description}
      image={image}
      // oxlint-disable-next-line jsx-a11y/alt-text, next/no-img-element
      logo={<img src={logoUrl} width={56} height={56} />}
      caption={url.hostname}
    />,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Geist',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
      ],
    },
  )
}

async function loadGoogleFont(fontName: string): Promise<ArrayBuffer> {
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}&display=swap`

  const response = await fetch(fontUrl)
  const cssText = await response.text()

  const fontFaceMatch = cssText.match(/@font-face\s*{[^}]*}/)
  if (!fontFaceMatch) throw new Error(`Font face not found for ${fontName}`)

  const [fontFace] = fontFaceMatch
  const urlMatch = fontFace.match(/url\(([^)]+)\)/)
  if (!urlMatch) throw new Error(`Font URL not found for ${fontName}`)

  const fontFileUrl = urlMatch[1]?.replaceAll(/['"]/g, '')
  const fontResponse = await fetch(fontFileUrl ?? '')
  return await fontResponse.arrayBuffer()
}
