import * as SecureStore from 'expo-secure-store'

const SESSION_TOKEN = 'session_token'
const ACCESS_TOKEN = 'access_token'

export const getSessionToken = () => SecureStore.getItem(SESSION_TOKEN)
export const setSessionToken = (token: string) =>
  SecureStore.setItemAsync(SESSION_TOKEN, token)
export const deleteSessionToken = () =>
  SecureStore.deleteItemAsync(SESSION_TOKEN)

export const getAccessToken = () => SecureStore.getItem(ACCESS_TOKEN)
export const setAccessToken = (token: string) =>
  SecureStore.setItemAsync(ACCESS_TOKEN, token)
export const deleteAccessToken = () => SecureStore.deleteItemAsync(ACCESS_TOKEN)
