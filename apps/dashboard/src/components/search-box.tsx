import { useSession } from '@yukinu/auth/react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@yukinu/ui/command'
import {
  ArrowLeftRightIcon,
  ChartBarIcon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  ExternalLinkIcon,
  HandCoinsIcon,
  LayoutDashboardIcon,
  MegaphoneIcon,
  MessageCircleQuestionIcon,
  PackageIcon,
  SearchIcon,
  StoreIcon,
  TagIcon,
  TicketsIcon,
  UsersIcon,
  UserStarIcon,
} from '@yukinu/ui/icons'
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@yukinu/ui/input-group'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'

import { env } from '@/lib/env'

export const SearchBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useSession()

  const filteredItems = useMemo(
    () =>
      items.map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.role.includes(user?.role ?? ''),
        ),
      })),
    [user?.role],
  )

  return (
    <>
      <InputGroup
        className='w-fit has-[[data-slot=input-group-control]:focus-visible]:border-border has-[[data-slot=input-group-control]:focus-visible]:ring-0'
        onClick={() => setIsOpen(true)}
      >
        <InputGroupInput
          placeholder='Search...'
          className='cursor-pointer caret-transparent'
          tabIndex={-1}
          readOnly
        />
        <InputGroupAddon align='inline-end'>
          <InputGroupButton
            size='icon-xs'
            className='cursor-pointer'
            tabIndex={-1}
          >
            <SearchIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <Command>
          <CommandInput placeholder='Type a command or search...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {filteredItems.map((group) => (
              <CommandGroup key={group.title} heading={group.title}>
                {group.items.map((item) => (
                  <Link key={item.href} to={item.href}>
                    <CommandItem onSelect={() => setIsOpen(false)}>
                      {item.icon && <item.icon />}
                      <span className='inline-flex items-center'>
                        {item.name}
                      </span>
                    </CommandItem>
                  </Link>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

const items = [
  {
    title: 'General',
    items: [
      {
        name: 'Dashboard',
        href: '/',
        icon: LayoutDashboardIcon,
        role: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
      },
      {
        name: 'Analytics',
        href: '/analytics',
        icon: ChartBarIcon,
        role: ['admin', 'moderator'],
      },
      {
        name: 'Support Tickets',
        href: '/support-tickets',
        icon: MessageCircleQuestionIcon,
        role: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
      },
      {
        name: 'Back to Store',
        href: env.VITE_WEB_URL,
        icon: ExternalLinkIcon,
        role: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        name: 'Users',
        href: '/management/users',
        icon: UsersIcon,
        role: ['admin', 'moderator'],
      },
      {
        name: 'Banners',
        href: '/management/banners',
        icon: MegaphoneIcon,
        role: ['admin', 'moderator'],
      },
      {
        name: 'Vouchers',
        href: '/management/vouchers',
        icon: TicketsIcon,
        role: ['admin', 'moderator'],
      },
      {
        name: 'Orders',
        href: '/management/orders',
        icon: ClipboardCheckIcon,
        role: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
      },
      {
        name: 'Vendors',
        href: '/management/vendors',
        icon: StoreIcon,
        role: ['admin', 'moderator'],
      },
      {
        name: 'Transactions',
        href: '/management/transactions',
        icon: ArrowLeftRightIcon,
        role: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
      },
    ],
  },
  {
    title: 'Catalog',
    items: [
      {
        name: 'Categories',
        href: '/catalog/categories',
        icon: TagIcon,
        role: ['admin', 'moderator'],
      },
      {
        name: (
          <>
            Categories <ChevronRightIcon /> New
          </>
        ),
        href: '/catalog/categories/new',
        icon: TagIcon,
        role: ['admin', 'moderator'],
      },
      {
        name: 'Products',
        href: '/catalog/products',
        icon: PackageIcon,
        role: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
      },
      {
        name: (
          <>
            Products <ChevronRightIcon /> New
          </>
        ),
        href: '/catalog/products/new',
        icon: PackageIcon,
        role: ['vendor_owner', 'vendor_staff'],
      },
    ],
  },
  {
    title: 'Merchant',
    items: [
      {
        name: 'My Store',
        href: '/merchant/my-store',
        icon: StoreIcon,
        role: ['vendor_owner'],
      },
      {
        name: 'Staffs',
        href: '/merchant/staffs',
        icon: UserStarIcon,
        role: ['vendor_owner'],
      },
      {
        name: 'Balance',
        href: '/merchant/balance',
        icon: HandCoinsIcon,
        role: ['vendor_owner'],
      },
    ],
  },
]
