import { getToken } from '@utils/cache'
const state = {
  token: getToken(), // 获取token
  user: {
    avatar: 'http://p.qpic.cn/music_cover/KetjXWSVppvyrVJfzfdpibicIiapI2YDTPgVfUAic9pbibicediaWyxmeNHRg/600?n=1',
    bgUrl: 'http://p.qpic.cn/music_cover/8eiaDBJ27yYicpMibYZmmEdNEPOTSqwhACUBwbPGUW9GDr0iarXDqvKo7g/600?n=1',
    nickname: '未登录',
    gender: '男',
    desc: '该用户没有签名呢~'
  }, // 用户信息
  list: [],
  person: {}
}
export default state