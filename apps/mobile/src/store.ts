import type { CountAction } from '@/slices/count.slice'

import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

import { countReducer } from '@/slices/count.slice'
import { todoReducer, type TodoAction } from '@/slices/todo.slice'

const store = configureStore({
  reducer: {
    count: countReducer,
    todo: todoReducer,
  },
})

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector<RootState, T>(selector)

type TypedDispatch = <TAction extends CountAction | TodoAction>(
  action: TAction,
) => TAction

const useAppDispatch: () => TypedDispatch = () => useDispatch<AppDispatch>()

export type { RootState, AppDispatch }
export { store, useAppSelector, useAppDispatch }
