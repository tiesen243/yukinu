import { env } from '@yukinu/validators/env'

export const loader = () => {
  console.log(env)
  return null
}

export default function HomePage() {
  return <div>Welcome to Yukinu Dashboard!</div>
}
