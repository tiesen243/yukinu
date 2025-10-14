import { Header } from '@/app/(main)/_components/header'

export default function MainLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
