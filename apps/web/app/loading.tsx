import { Loader2Icon } from '@yukinu/ui/icons'

export default function Loading() {
  return (
    <main className='container grid flex-1 place-items-center'>
      <Loader2Icon className='animate-spin' />
      <span className='sr-only'>Loading...</span>
    </main>
  )
}
