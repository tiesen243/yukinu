interface AccountHeaderProps {
  title: string
  description: string
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({
  title,
  description,
}) => (
  <div className='flex flex-col gap-1 border-b px-6 pb-6 md:h-16 md:pb-0'>
    <h1 className='text-xl font-medium text-balance'>{title}</h1>
    <p className='text-sm text-pretty text-muted-foreground md:line-clamp-1'>
      {description}
    </p>
  </div>
)
