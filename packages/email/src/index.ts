import { Resend } from 'resend'

import { env } from '@yuki/validators/env'

import * as email from './emails'

const resend = new Resend(env.RESEND_TOKEN)

export interface SendEmailParams {
  to: string
  subject: string
  email: keyof typeof email
  data?: Record<string, unknown>
}

async function sendEmail(params: SendEmailParams) {
  const res = await resend.emails.send({
    from: 'noreply@tiesen.id.vn',
    to: params.to,
    subject: params.subject,
    react: email[params.email](params),
  })

  if (env.NODE_ENV === 'development') console.log('Email sent:', res)
}

export { resend, sendEmail }
