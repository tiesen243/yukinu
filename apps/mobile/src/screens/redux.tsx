import { PlusIcon } from 'lucide-react-native'
import * as React from 'react'
import { FlatList, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store'

export function ReduxScreen() {
  const insets = useSafeAreaInsets()

  return (
    <View
      className='bg-background flex-1'
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className='container flex-1 gap-8 py-4'>
        <Counter />

        <TodoList />
      </View>
    </View>
  )
}

const Counter: React.FC = () => {
  const count = useAppSelector((state) => state.count)
  const dispatch = useAppDispatch()

  return (
    <View className='bg-card border border-border p-4 rounded-xl gap-4'>
      <Text
        className='text-2xl text-card-foreground text-center'
        style={{ fontFamily: 'Geist_500Medium' }}
      >
        Counter: {count}
      </Text>

      <View className='flex-row justify-center gap-2'>
        <Button
          onPress={() =>
            dispatch({ type: 'count/increment', payload: undefined })
          }
        >
          Increment
        </Button>

        <Button
          onPress={() =>
            dispatch({ type: 'count/decrement', payload: undefined })
          }
        >
          Decrement
        </Button>

        <Button
          onPress={() => dispatch({ type: 'count/reset', payload: undefined })}
        >
          Reset
        </Button>
      </View>
    </View>
  )
}

const TodoList: React.FC = () => {
  const [text, setText] = React.useState('')
  const todos = useAppSelector((state) => state.todo)
  const dispatch = useAppDispatch()

  return (
    <View className='flex-1 bg-card border border-border p-4 rounded-xl gap-4'>
      <Text
        className='text-2xl text-card-foreground'
        style={{ fontFamily: 'Geist_500Medium' }}
      >
        Todo List
      </Text>
      <View className='flex-row items-center gap-2'>
        <TextInput
          className='bg-input text-card-foreground rounded-md px-2 flex-1'
          placeholder='Enter todo item'
          placeholderTextColor='#c0c0c0'
          value={text}
          onChangeText={setText}
        />

        <Button
          size='icon-xl'
          onPress={() => {
            if (!text.trim()) return
            dispatch({ type: 'todo/addTodo', payload: text })
            setText('')
          }}
        >
          <PlusIcon color='#fafafa' />
        </Button>
      </View>

      <FlatList
        data={todos}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <View className='flex flex-row justify-between items-center mb-2'>
            <Text className='text-card-foreground'>{item.text}</Text>
            <Button
              variant='destructive'
              onPress={() =>
                dispatch({ type: 'todo/removeTodo', payload: item.id })
              }
            >
              Remove
            </Button>
          </View>
        )}
        ListEmptyComponent={
          <Text className='text-card-foreground'>No todos available.</Text>
        }
      />
    </View>
  )
}
