import { Footer } from '@/app/_components/footer'

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
