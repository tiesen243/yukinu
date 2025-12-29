import { buttonVariants } from '@yukinu/ui/button'
import { PlusIcon } from 'lucide-react-native'
import * as React from 'react'
import { FlatList, Pressable, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAppDispatch, useAppSelector } from '@/store'

export function ReduxScreen() {
  return (
    <SafeAreaView className='flex-1 bg-background flex flex-col justify-center'>
      <View className='container h-full flex flex-col justify-center items-center gap-8'>
        <Counter />
        <TodoList />
      </View>
    </SafeAreaView>
  )
}

const Counter: React.FC = () => {
  const count = useAppSelector((state) => state.count)
  const dispatch = useAppDispatch()

  return (
    <View className='bg-card border border-border p-4 rounded-xl flex flex-col gap-4 items-center w-full'>
      <Text className='text-2xl text-card-foreground'>Counter: {count}</Text>

      <View className='flex flex-row gap-4'>
        <Pressable
          className={buttonVariants()}
          onPress={() =>
            dispatch({ type: 'count/increment', payload: undefined })
          }
        >
          <Text className='text-primary-foreground'>Increment</Text>
        </Pressable>

        <Pressable
          className={buttonVariants()}
          onPress={() =>
            dispatch({ type: 'count/decrement', payload: undefined })
          }
        >
          <Text className='text-primary-foreground'>Decrement</Text>
        </Pressable>

        <Pressable
          className={buttonVariants()}
          onPress={() => dispatch({ type: 'count/reset', payload: undefined })}
        >
          <Text className='text-primary-foreground'>Reset</Text>
        </Pressable>
      </View>
    </View>
  )
}

const TodoList: React.FC = () => {
  const [text, setText] = React.useState('')
  const todos = useAppSelector((state) => state.todo)
  const dispatch = useAppDispatch()

  return (
    <View className='bg-card border border-border p-4 rounded-xl flex flex-col gap-4 w-full flex-1'>
      <Text className='text-2xl text-card-foreground'>Todo List</Text>
      <View className='flex flex-row items-center gap-2'>
        <TextInput
          className='bg-input text-card-foreground rounded-md px-2 flex-1'
          placeholder='Enter todo item'
          placeholderTextColor='#c0c0c0'
          value={text}
          onChangeText={setText}
        />

        <Pressable
          className={buttonVariants({ size: 'icon-xl' })}
          onPress={() => {
            if (!text.trim()) return
            dispatch({ type: 'todo/addTodo', payload: text })
            setText('')
          }}
        >
          <PlusIcon color='#fafafa' />
        </Pressable>
      </View>

      <FlatList
        data={todos}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <View className='flex flex-row justify-between items-center mb-2'>
            <Text className='text-card-foreground'>{item.text}</Text>
            <Pressable
              className={buttonVariants({ variant: 'destructive' })}
              onPress={() =>
                dispatch({ type: 'todo/removeTodo', payload: item.id })
              }
            >
              <Text className='text-destructive'>Remove</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text className='text-card-foreground'>No todos available.</Text>
        }
      />
    </View>
  )
}
