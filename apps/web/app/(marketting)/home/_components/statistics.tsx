export function StatisticsSection() {
  return (
    <section
      id='statistics'
      className='scroll-mt-14 border-y border-border bg-card/30 py-12 md:py-16'
    >
      <h2 className='sr-only'>Statistics section</h2>

      <div className='container'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          <div>
            <div className='text-3xl font-bold md:text-4xl'>50K+</div>
            <p className='mt-2 text-sm text-muted-foreground'>Active Vendors</p>
          </div>
          <div>
            <div className='text-3xl font-bold md:text-4xl'>$2B+</div>
            <p className='mt-2 text-sm text-muted-foreground'>Transactions</p>
          </div>
          <div>
            <div className='text-3xl font-bold md:text-4xl'>99.9%</div>
            <p className='mt-2 text-sm text-muted-foreground'>Uptime</p>
          </div>
          <div>
            <div className='text-3xl font-bold md:text-4xl'>150+</div>
            <p className='mt-2 text-sm text-muted-foreground'>Countries</p>
          </div>
        </div>
      </div>
    </section>
  )
}
