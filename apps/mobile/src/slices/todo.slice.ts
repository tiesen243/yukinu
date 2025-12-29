import { createSlice } from '@reduxjs/toolkit'

export interface Todo {
  id: string
  text: string
}

const todoSlice = createSlice({
  name: 'todo',
  initialState: [] as Todo[],
  reducers: {
    addTodo: (state, action: { payload: string }) => {
      state.push({
        id: Math.random().toString(36).slice(2, 9),
        text: action.payload,
      })
    },
    removeTodo: (state, action: { payload: Todo['id'] }) =>
      state.filter((todo) => todo.id !== action.payload),
    clearTodos: () => [],
  },
})

export type TodoAction = ReturnType<
  (typeof todoSlice.actions)[keyof typeof todoSlice.actions]
>

export const todoReducer = todoSlice.reducer
