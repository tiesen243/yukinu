import * as z from 'zod'

export const usernameSchema = z
  .string()
  .trim()
  .min(2, 'Username too short')
  .max(100, 'Username too long')
  .transform((val) => val.toLowerCase())

export const passwordSchema = z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
    'Password not strong enough',
  )
