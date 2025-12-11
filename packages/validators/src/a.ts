import { ProductValidators } from '@/product'

const product = {
  id: 'c3io4wjz30j05rfwmwlu2sby',
  name: 'lorem ipsum 3',
  description: null,
  price: '0.00',
  stock: 0,
  sold: 0,
  category: {
    id: 'cxgf8crt1e4gqp05l67oj9zn',
    name: 'Novels',
  },
  images: null,
  attributes: null,
  vendor: {
    id: 'c6p57sjkg6ls88488fupucel',
    name: 'a',
    image: null,
    address: null,
  },
  reviews: null,
  createdAt: new Date('2025-12-10T23:42:13.792Z'),
  updatedAt: new Date('2025-12-10T23:42:13.792Z'),
  variants: [],
}

console.log(ProductValidators.oneOutput.parse(product))
