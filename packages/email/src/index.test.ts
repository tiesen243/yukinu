import { sendEmail } from '@/index'

sendEmail({
  to: 'tiesen243@tiesen.id.vn',
  subject: 'Test Email',
  template: 'ResetPassword',
  data: {
    username: 'tiesen',
    resetLink: 'https://example.com/reset-password?token=abc123',
  },
})
  .then((res) => {
    console.log('Email sent successfully:', res)
  })
  .catch((err: unknown) => {
    console.error('Error sending email:', err)
  })
