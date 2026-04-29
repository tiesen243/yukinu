import type { TRPCRouterRecord } from '@trpc/server'

import { serializeTokenCookie } from '@yukinu/auth'

import type { UseCases } from '@/modules/identity/types'

import { SignInDto } from '@/modules/identity/application/dtos/sign-in.dto'
import { SignUpDto } from '@/modules/identity/application/dtos/sign-up.dto'
import { publicProcedure } from '@/trpc'

export const authRouter = (useCases: UseCases) =>
  ({
    signIn: publicProcedure
      .meta({ message: 'Sign in to your account' })
      .input(SignInDto.input)
      .output(SignInDto.output)
      .mutation(({ ctx, input }) =>
        // oxlint-disable-next-line promise/prefer-await-to-then
        useCases.signIn.execute(input).then((result) => {
          const { accessToken, refreshToken, expiresAt } = result
          ctx.resHeaders.append(
            'Set-Cookie',
            serializeTokenCookie('refreshToken', refreshToken, expiresAt),
          )
          ctx.resHeaders.append(
            'Set-Cookie',
            serializeTokenCookie('accessToken', accessToken),
          )

          return result
        }),
      ),

    signUp: publicProcedure
      .meta({ message: 'Create a new account' })
      .input(SignUpDto.input)
      .output(SignUpDto.output)
      .mutation(({ input }) => useCases.signUp.execute(input)),
  }) satisfies TRPCRouterRecord
