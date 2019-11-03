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
  [types.SET_USER_ATTRIBUTE] (state, { attribute, key }) {
    state.user[attribute] = key
  },
  [types.SET_LIST] (state, obj) {
    const list = obj.article
    const like = obj.like
    const comments = obj.comment
    list.forEach(element => {
      element.picList = element.picList.split(',')
      element.created_at = new Date(element.created_at)
      element.like = []
      element.comment = []
      like.forEach(item => {
        if (element.id === item.articleId) {
          element.like.push(item.nickname)
        }
      })
      comments.forEach(item => {
        if (element.id === item.articleId) {
          element.comment.push({
            'nickname': item.nickname,
            'comment': item.comment
          })
        }
      })
    })
    state.list = list
  },
  [types.SET_CONCAT_LIST] (state, obj) {
    const list = obj.article
    const like = obj.like
    const comments = obj.comment
    list.forEach(element => {
      element.picList = element.picList.split(',')
      element.created_at = new Date(element.created_at)
      element.like = []
      element.comment = []
      like.forEach(item => {
        if (element.id === item.articleId) {
          element.like.push(item.nickname)
        }
      })
      comments.forEach(item => {
        if (element.id === item.articleId) {
          element.comment.push({
            'nickname': item.nickname,
            'comment': item.comment
          })
        }
      })
    })
    state.list = state.list.concat(list)
  },
  [types.SET_LIKE] (state, obj) {
    state.list[obj.index].like.push(obj.nickname)
  },
  [types.SET_DISLIKE] (state, obj) {
    state.list[obj.index].like.pop()
  },
  [types.SET_COMMENT] (state, obj) {
    state.list[obj.index].comment.push({
      'nickname': obj.nickname,
      'comment': obj.comment
    })
  },
  [types.SET_PERSON] (state, person) {
    state.person = person
  },
}
export default mutations