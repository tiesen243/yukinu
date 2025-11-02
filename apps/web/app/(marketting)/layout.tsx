import { Footer } from '@/app/_components/footer'
import { Header } from '@/app/_components/header-marketing'

export default function MarkettingLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
