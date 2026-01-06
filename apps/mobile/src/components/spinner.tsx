import { Loader2Icon } from 'lucide-react-native'
import * as React from 'react'
import { Animated, Easing } from 'react-native'

import { Icon } from '@/components/ui/icon'

export const Spinner: React.FC = () => {
  const spinRef = React.useRef(new Animated.Value(0))

  const spin = React.useCallback(() => {
    spinRef.current.setValue(0)
    Animated.timing(spinRef.current, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => spin())
  }, [spinRef])

  React.useEffect(() => {
    spin()

    const spinValue = spinRef.current
    return () => spinValue.stopAnimation()
  }, [spin])

  const rotate = spinRef.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <Animated.View
      className='flex-1 items-center justify-center'
      style={{ transform: [{ rotate }] }}
    >
      <Icon as={Loader2Icon} />
    </Animated.View>
  )
}
