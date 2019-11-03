<template>
  <div class="chat-list">
    <div class="chat-list-header border-bottom-1px">
      <i class="cubeic-back"
         @click="back"></i>
      <p class="label">我的私信</p>
    </div>
    <div class="chat-list-container">
      <div class="list-box border-bottom-1px"
           v-for="item in chatlist"
           :key="item.id">
        <img v-lazy="item.avatar"
             class="avatar">
        <div class="list-right"
             @click="toChat(item.fromUser,item.toUser)">
          <div class="top">
            <span>{{item.nickname}}</span>
            <span class="time">{{leaveNow(item.updated_at)}}</span>
          </div>
          <div class="bottom">
            <span>{{item.content.length?item.content:'[图片]'}}</span>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import service from '@utils/service'
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters(['token', 'user'])
  },
  created () {
    this._getData()
  },
  data () {
    return {
      chatlist: []
    }
  },
  methods: {
    async _getData () {
      const res = await service.get('/chatlist', {
      }, this.token)
      res.forEach(async element => {
        const uid = this.user.id === element.fromUser ? element.toUser : element.fromUser
        const result = await service.get(`/user/${uid}`)
        this.chatlist.push({
          avatar: result.data.avatar,
          content: element.content,
          fromUser: element.fromUser,
          id: element.id,
          nickname: result.data.nickname,
          toUser: element.toUser,
          created_at: element.created_at,
          updated_at: element.updated_at
        })
      })
    },
    async toChat (fromUser, toUser) {
      const uid = this.user.id === fromUser ? toUser : fromUser
      const res = await service.get(`/user/${uid}`)
      this.set_person(res.data)
      this.$router.push({
        path: '/personal/chatlist/chat'
      })
    },
    leaveNow (time) {
      var mistiming = Math.round((Date.now() - new Date(time)) / 1000)
      const arrr = ['年', '个月', '星期', '天', '小时', '分钟', '秒']
      const arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1]
      for (var i = 0; i < arrn.length; i++) {
        var inm = Math.floor(mistiming / arrn[i]);
        if (inm != 0) {
          if (arrr[i] == '天' && inm == 1) return '昨天'
          return inm + arrr[i] + '前';
        }
      }
      return 'error'
    },
    back () {
      this.$router.back()
    },
    ...mapMutations({
      'set_person': "SET_PERSON"
    })
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/myColor'
.chat-list
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  background-color $bgc-grey
  .chat-list-header
    width 100%
    height 60px
    position relative
    .cubeic-back
      position absolute
      top 20px
      left 20px
      font-size 22px
      color $font
    .label
      line-height 60px
      height 100%
      font-weight 700
      font-size 18px
      text-align center
  .chat-list-container
    position absolute
    top 60px
    left 0
    right 0
    bottom 0
    background-color #fff
    .list-box
      padding 10px
      display flex
      flex-direction row
      align-items center
      .avatar
        width 47px
        height 47px
        border-radius 10px
        margin-right 10px
      .list-right
        flex 1
        display flex
        flex-direction column
        justify-content space-around
        height 47px
        .top
          display flex
          flex-direction row
          justify-content space-between
          align-items center
          font-size 16px
          .time
            color #a3a3a3
            font-size 14px
        .bottom
          font-size 14px
          line-height 14px
          width 80%
          white-space nowrap
          overflow hidden
          text-overflow ellipsis
          color #818181
</style>