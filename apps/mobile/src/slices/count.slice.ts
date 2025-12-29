import { createSlice } from '@reduxjs/toolkit'

const countSlice = createSlice({
  name: 'count',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
    reset: () => 0,
  },
})

export type CountAction = ReturnType<
  (typeof countSlice.actions)[keyof typeof countSlice.actions]
>

export const countReducer = countSlice.reducer
