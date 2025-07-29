import { db } from '.'
import { categories, products } from './schema'

async function main() {
  const categoryData = await fetchRandomCategories()
  const productData = await fetchRandomProducts()

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .returning()

  await db.insert(products).values(
    productData.map((product) => ({
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
      stock: Math.floor(Math.random() * 100) + 1,
      categoryId:
        insertedCategories.find(
          (category) => category.name === product.category,
        )?.id ?? '',
      sellerId: 'cmd8u77bfgqhevlj9h6ccwy67',
    })),
  )
}

void main()

async function fetchRandomCategories() {
  const response = await fetch('https://api.escuelajs.co/api/v1/categories')
  const categories = (await response.json()) as { name: string }[]
  return categories.map((category) => ({ name: category.name }))
}

async function fetchRandomProducts() {
  const response = await fetch('https://api.escuelajs.co/api/v1/products')
  const products = (await response.json()) as {
    title: string
    description: string
    images: string[]
    price: number
    category: { name: string }
  }[]
  return products.map((product) => ({
    name: product.title,
    description: product.description,
    image: product.images[0] ?? '',
    price: product.price,
    category: product.category.name,
  }))
}
