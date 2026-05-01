import type { TRPCRouterRecord } from '@trpc/server'

import { currentUser, serializeTokenCookie } from '@yukinu/auth'

import type { UseCases } from '@/modules/identity/types'

import { ForgotPasswordDto } from '@/modules/identity/application/dtos/auth/forgot-password.dto'
import { ResetPasswordDto } from '@/modules/identity/application/dtos/auth/reset-password.dto'
import { SignInDto } from '@/modules/identity/application/dtos/auth/sign-in.dto'
import { SignUpDto } from '@/modules/identity/application/dtos/auth/sign-up.dto'
import { VerifyEmailDto } from '@/modules/identity/application/dtos/auth/verify-email.dto'
import { protectedProcedure, publicProcedure } from '@/trpc'

export const authRouter = ({ auth }: UseCases) =>
  ({
    currentUser: protectedProcedure.query(({ ctx }) =>
      currentUser({ headers: ctx.reqHeaders }),
    ),

    signIn: publicProcedure
      .input(SignInDto.input)
      .output(SignInDto.output)
      .mutation(({ ctx, input }) =>
        auth.signIn
          .execute({ ...input, reqHeaders: ctx.reqHeaders })
          // oxlint-disable-next-line promise/prefer-await-to-then
          .then((result) => {
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
      .input(SignUpDto.input)
      .output(SignUpDto.output)
      .mutation(({ input }) => auth.signUp.execute(input)),

    forgotPassword: publicProcedure
      .input(ForgotPasswordDto.input)
      .output(ForgotPasswordDto.output)
      .mutation(({ input }) => auth.forgotPassword.execute(input)),

    resetPassword: publicProcedure
      .input(ResetPasswordDto.input)
      .output(ResetPasswordDto.output)
      .mutation(({ input }) => auth.resetPassword.execute(input)),

    verifyEmail: publicProcedure
      .input(VerifyEmailDto.input)
      .output(VerifyEmailDto.output)
      .mutation(({ input }) => auth.verifyEmail.execute(input)),
  }) satisfies TRPCRouterRecord
