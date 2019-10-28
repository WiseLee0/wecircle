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
  },
  [types.SET_LIST] (state, list) {
    list.forEach(element => {
      element.picList = element.picList.split(',')
      element.created_at = new Date(element.created_at)
    })
    state.list = list
  }
}
export default mutations