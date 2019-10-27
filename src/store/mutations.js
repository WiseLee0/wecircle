import * as types from './mutation-type'
import { deleteToken, saveToken } from '@utils/cache'
const mutations = {
  [types.SET_TOKEN] (state, token) {
    state.token = token
    saveToken(token)
  },
  [types.DELETE_TOKEN] (state) {
    deleteToken()
    state.token = ''
  },
  [types.SET_USER] (state, user) {
    state.user = user
  }
}
export default mutations