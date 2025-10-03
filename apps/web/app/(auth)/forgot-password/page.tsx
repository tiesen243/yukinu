import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yukinu/ui/card'

export default function ForgotPasswordPage(_: PageProps<'/forgot-password'>) {
  return (
    <>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address below and we'll send you a link to reset your
          password.
        </CardDescription>
      </CardHeader>

      <CardContent className='text-sm text-muted-foreground'>
        Not implemented yet.
      </CardContent>
    </>
  )
}
