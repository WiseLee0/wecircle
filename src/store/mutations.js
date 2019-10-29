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
  [types.SET_LIST] (state, obj) {
    const list = obj.article
    const like = obj.like
    list.forEach(element => {
      element.picList = element.picList.split(',')
      element.created_at = new Date(element.created_at)
      element.like = []
      like.forEach(item => {
        if (element.id === item.articleId) {
          element.like.push(item.nickname)
        }
      })
    })
    state.list = list
  },
  [types.SET_LIKE] (state, obj) {
    state.list[obj.index].like.push(obj.nickname)
  },
  [types.SET_DISLIKE] (state, obj) {
    state.list[obj.index].like.pop()
  }
}
export default mutations