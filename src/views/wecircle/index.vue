<template>
  <div class="wecircle">
    <header-bar :headerClass="headerClass"
                @toPublish="toPublish"></header-bar>
    <cube-scroll ref="scroll"
                 :options="options"
                 :scroll-events="scrollEvents"
                 @scroll="onScroll">
      <img :src="user.bgUrl"
           class="bg-img"
           ref="bgImg">
      <div class="mask"></div>
      <div class="name-info">
        <p class="nickname">{{user.nickname}}</p>
        <img class="avatar"
             :src="user.avatar">
      </div>
      <div v-for="card in list"
           :key="card.id">
        <list-card :card="card"></list-card>
      </div>
    </cube-scroll>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import headerBar from '@components/header-bar'
import listCard from '@components/list-card'
import service from '@utils/service'
export default {
  data () {
    return {
      scrollEvents: ['scroll'],
      headerClass: '',
      options: {
        bounce: false
      },
      list: []
    }
  },
  computed: {
    ...mapGetters(['token', 'user'])
  },
  created () {
    this.getUserMsg()
  },
  methods: {
    /**
     * 获取信息
     */
    async getUserMsg () {
      if (this.token.length) {
        this._getApiMsg()
      }
      const res = await service.get('/publish/article/1')
      res.forEach(element => {
        element.picList = element.picList.split(',')
      })
      console.log(res)
      this.list = res
    },
    /**
     * 发布动态
     */
    toPublish () {
      if (this.token.length) {
        this.$router.push({
          path: '/publish'
        })
      } else {
        this.$router.push({
          path: '/login'
        })
      }
    },
    /**
    * 滚动事件
    */
    onScroll ({ y }) {
      if (-y >= 150) this.headerClass = 'show'
      else this.headerClass = ''

      if (-y >= 57) this.$refs.bgImg.style.filter = 'blur(2px)'
      else this.$refs.bgImg.style.filter = 'blur(0px)'
    },
    /**
     * 用户信息获取请求
     */
    async _getApiMsg () {
      const res = await service.get('/user/msg', {}, this.token)
      if (res.code === 0) this.set_user(res.data)
      else
        // token 过期删除令牌
        if (this.token.length) this.delete_token()

    },
    /**
     * vuex
     */
    ...mapMutations({
      'delete_token': 'DELETE_TOKEN',
      'set_user': 'SET_USER'
    })
  },
  components: {
    headerBar,
    listCard
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/myColor'
.wecircle
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  .bg-img
    height 320px
    width 100%
  .mask
    height 320px
    background-color rgba(0, 0, 0, 0.3)
    position absolute
    top 0
    left 0
    right 0
  .name-info
    position absolute
    right 12px
    top 273px
    border-radius 5px
    display flex
    .nickname
      margin-right 24px
      margin-top 20px
      color #fff
      text-shadow 1px 1px 2px #000000
      font-size 16px
      letter-spacing 2px
    .avatar
      width 66px
      height 66px
      border-radius 4px
</style>