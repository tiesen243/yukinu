import { Footer } from '@/app/_components/footer'
import { Header } from '@/app/_components/header-marketing'

export default function MarketingLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
