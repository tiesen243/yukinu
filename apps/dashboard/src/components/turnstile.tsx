import { Card } from '@yukinu/ui/card'
import { Outlet } from 'react-router'

import { TurnstileChallengeScript } from '@/components/turnstile.provider'

import type { Route } from './+types/turnstile'

export default function TurnstileChallenge(_: Route.ComponentProps) {
  return (
    <TurnstileChallengeScript>
      <main className='flex h-dvh flex-col items-center justify-center px-4'>
        <Card className='min-w-full md:max-w-xl md:min-w-xl'>
          <Outlet />
        </Card>
      </main>
    </TurnstileChallengeScript>
  )
}
