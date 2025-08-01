import { Form, useNavigate } from 'react-router'

import { useSession } from '@yuki/auth/react'
import { Button } from '@yuki/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'
import { useForm } from '@yuki/ui/form'
import { FacebookIcon, GoogleIcon } from '@yuki/ui/icons'
import { Input } from '@yuki/ui/input'
import { toast } from '@yuki/ui/sonner'
import { signInSchema } from '@yuki/validators/auth'

import { createMetadata } from '@/lib/metadata'

export const meta = createMetadata({
  title: 'Login',
  description: 'Login to your account',
})

export default function AuthPage() {
  const { signIn } = useSession()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validator: signInSchema,
    onSubmit: (value) => signIn('credentials', value),
    onSuccess: () => {
      toast.success('Login successful!')
      void navigate('/')
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })

  return (
    <main className='grid h-dvh place-items-center'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Please enter your email and password to sign in.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className='grid gap-4'
          >
            <form.Field
              name='email'
              render={({ field, meta }) => (
                <div id={meta.id} className='grid gap-2'>
                  <form.Label>Email</form.Label>
                  <form.Control {...field}>
                    <Input type='email' placeholder='yuki@example.com' />
                  </form.Control>
                  <form.Message />
                </div>
              )}
            />

            <form.Field
              name='password'
              render={({ field, meta }) => (
                <div id={meta.id} className='grid gap-2'>
                  <form.Label>Password</form.Label>
                  <form.Control {...field}>
                    <Input type='password' placeholder='********' />
                  </form.Control>
                  <form.Message />
                </div>
              )}
            />

            <Button disabled={form.state.isPending}>Login</Button>
          </form>
        </CardContent>

        <CardFooter className='flex-col gap-2'>
          <div className='flex w-full items-center gap-4'>
            <div className='h-[1px] grow bg-border' />
            <span className='text-sm'>Or continue with</span>
            <div className='h-[1px] grow bg-border' />
          </div>

          <Form className='grid w-full grid-cols-2 gap-2'>
            <Button variant='outline' formAction='/api/auth/facebook'>
              <FacebookIcon /> Facebook
            </Button>

            <Button variant='outline' formAction='/api/auth/google'>
              <GoogleIcon /> Google
            </Button>
          </Form>
        </CardFooter>
      </Card>
    </main>
  )
}
