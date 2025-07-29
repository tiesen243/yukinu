import { Resend } from 'resend'

import { env } from '@yuki/validators/env'

import * as email from './emails'

const resend = new Resend(env.RESEND_TOKEN)

export interface SendEmailParams {
  email: keyof typeof email
  to: string
  subject: string
  text: string
  data?: Record<string, unknown>
}

async function sendEmail(params: SendEmailParams) {
  const res = await resend.emails.send({
    from: 'yukinu@tiesen.id.vn',
    to: params.to,
    subject: params.subject,
    text: params.text,
    react: email[params.email](params as never),
  })

  if (env.NODE_ENV === 'development') console.log('Email sent:', res)
}

export { resend, sendEmail }
