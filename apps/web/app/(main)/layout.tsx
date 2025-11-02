import { Footer } from '@/app/_components/footer'
import { Header } from '@/app/_components/header-main'

export default function MainLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
