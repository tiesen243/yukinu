import { Resend } from 'resend'

import * as templates from '@/templates'

const resend = new Resend(process.env.RESEND_TOKEN)

interface SendEmailOptions<T extends keyof typeof templates> {
  to: string
  subject: string
  template: T
  data: React.ComponentProps<(typeof templates)[T]>
}

export async function sendEmail<T extends keyof typeof templates>(
  opts: SendEmailOptions<T>,
) {
  const res = await resend.emails.send({
    from: 'Yukinu <no-reply@tiesen.id.vn>',
    to: opts.to,
    subject: opts.subject,
    react: templates[opts.template](opts.data as never),
  })

  if (res.error) throw new Error(res.error.message)
  return res.data
}
