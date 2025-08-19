import { Outlet } from 'react-router'

export default function AuthLayout() {
  return (
    <main className='grid h-dvh place-items-center'>
      <Outlet />
    </main>
  )
}
