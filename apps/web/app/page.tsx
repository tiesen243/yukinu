import { Typography } from '@yukinu/ui/typography'

export default function Home() {
  return (
    <main className='container flex min-h-screen flex-col items-center justify-center gap-4 text-center'>
      <Typography variant='h1'>Welcome to Yukinu</Typography>
      <Typography className='text-muted-foreground'>
        Your one-stop shop for all your needs.
      </Typography>
    </main>
  )
}
