import storage from 'good-storage'

const TOKEN_KEY = '__token__'

export function getToken () {
  return storage.get(TOKEN_KEY, [])
}

export function saveToken (token) {
  storage.set(TOKEN_KEY, token)
}

export function deleteToken () {
  storage.remove(TOKEN_KEY)
  return []
}