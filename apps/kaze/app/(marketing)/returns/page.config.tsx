import {
  CalendarIcon,
  CheckCircleIcon,
  DollarSignIcon,
  InfoIcon,
  PackageIcon,
  RefreshCwIcon,
  TruckIcon,
} from '@yuki/ui/icons'

export const returnFeatures = [
  {
    icon: <RefreshCwIcon className="h-6 w-6" />,
    title: '30-Day Returns',
    description: 'Hassle-free returns within 30 days of delivery.',
  },
  {
    icon: <DollarSignIcon className="h-6 w-6" />,
    title: 'Full Refunds',
    description: 'Refunds issued to your original payment method.',
  },
  {
    icon: <TruckIcon className="h-6 w-6" />,
    title: 'Easy Shipping',
    description: 'Pre-paid return labels for your convenience.',
  },
]

export const returnEligibility = [
  {
    icon: <CalendarIcon className="h-6 w-6" />,
    title: 'Return Window',
    description: 'Items must be returned within 30 days of delivery.',
  },
  {
    icon: <PackageIcon className="h-6 w-6" />,
    title: 'Item Condition',
    description:
      'Items must be unused, in original packaging, and with all tags attached.',
  },
  {
    icon: <CheckCircleIcon className="h-6 w-6" />,
    title: 'Proof of Purchase',
    description:
      'Original receipt or order confirmation is required for all returns.',
  },
]

export const nonReturnableItems = [
  'Digital products (e.g., software, e-books)',
  'Gift cards',
  'Perishable goods (e.g., food, flowers)',
  'Personalized or custom-made items',
  'Health and personal care items (e.g., opened cosmetics)',
  'Intimate apparel or swimwear (for hygiene reasons)',
  "Items marked as 'Final Sale' or 'Non-Returnable'",
]

export const returnProcessSteps = [
  {
    step: 1,
    title: 'Initiate Your Return',
    description:
      "Log in to your Yukinu account, go to 'My Orders', select the item you wish to return, and click 'Initiate Return'. Follow the prompts to provide details.",
    icon: <InfoIcon className="h-6 w-6" />,
  },
  {
    step: 2,
    title: 'Prepare Your Package',
    description:
      'Pack the item securely in its original packaging, including all accessories, manuals, and tags. Attach the provided return label to the outside of the package.',
    icon: <PackageIcon className="h-6 w-6" />,
  },
  {
    step: 3,
    title: 'Ship Your Item',
    description:
      'Drop off your package at the designated shipping carrier location (e.g., USPS, FedEx, UPS). Keep your tracking number for reference.',
    icon: <TruckIcon className="h-6 w-6" />,
  },
  {
    step: 4,
    title: 'Receive Refund/Exchange',
    description:
      'Once we receive and inspect your returned item, we will process your refund or exchange within 5-7 business days. You will receive an email notification.',
    icon: <DollarSignIcon className="h-6 w-6" />,
  },
]
