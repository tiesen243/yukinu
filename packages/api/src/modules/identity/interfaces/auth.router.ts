import type { TRPCRouterRecord } from '@trpc/server'

import { currentUser, serializeTokenCookie } from '@yukinu/auth'

import type { UseCases } from '@/modules/identity/types'

import { ForgotPasswordDto } from '@/modules/identity/application/dtos/forgot-password.dto'
import { ResetPasswordDto } from '@/modules/identity/application/dtos/reset-password.dto'
import { SignInDto } from '@/modules/identity/application/dtos/sign-in.dto'
import { SignUpDto } from '@/modules/identity/application/dtos/sign-up.dto'
import { VerifyEmailDto } from '@/modules/identity/application/dtos/verify-email.dto'
import { protectedProcedure, publicProcedure } from '@/trpc'

export const authRouter = (useCases: UseCases) =>
  ({
    currentUser: protectedProcedure
      .meta({ message: 'Get the currently authenticated user' })
      .query(({ ctx }) => currentUser(ctx.req)),

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

    forgotPassword: publicProcedure
      .meta({ message: 'Request a password reset' })
      .input(ForgotPasswordDto.input)
      .output(ForgotPasswordDto.output)
      .mutation(({ input }) => useCases.forgotPassword.execute(input)),

    resetPassword: publicProcedure
      .meta({ message: 'Reset your password' })
      .input(ResetPasswordDto.input)
      .output(ResetPasswordDto.output)
      .mutation(({ input }) => useCases.resetPassword.execute(input)),

    verifyEmail: publicProcedure
      .meta({ message: 'Verify your email address' })
      .input(VerifyEmailDto.input)
      .output(VerifyEmailDto.output)
      .mutation(({ input }) => useCases.verifyEmail.execute(input)),
  }) satisfies TRPCRouterRecord
