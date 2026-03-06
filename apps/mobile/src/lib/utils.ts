import { NativeModules } from 'react-native'

export function getBaseUrl() {
  const { scriptURL } = NativeModules.SourceCode.getConstants()

  if (__DEV__ && scriptURL) {
    const { hostname } = new URL(scriptURL)
    return `http://${hostname}:3000`
  }

  return 'https://api.example.com'
}
