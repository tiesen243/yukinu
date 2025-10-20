import { useSession } from '@yukinu/auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'

export const User: React.FC = () => {
  const { session, status } = useSession()

  if (status === 'loading')
    return <div className='size-9 animate-pulse rounded-full bg-muted' />
  if (status === 'unauthenticated') return null

  return (
    <Avatar>
      <AvatarImage
        src={session.user.avatarUrl ?? ''}
        alt={session.user.username}
      />
      <AvatarFallback>
        {session.user.username.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
