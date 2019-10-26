<template>
  <div class="wecircle">
    <header-bar :headerClass="headerClass"></header-bar>
    <cube-scroll ref="scroll"
                 :scroll-events="scrollEvents"
                 @scroll="onScroll">
      <img src="http://p.qpic.cn/music_cover/fGXwMYtCWNFSaEaFYicbqtYnXwPpSPEPws5nvOQLSmG4VWMibVAibdG6w/600?n=1"
           class="bg-img">
      <div class="name-info">
        <p class="nickname">随时随地</p>
        <img class="avatar"
             src="http://p.qpic.cn/music_cover/fGXwMYtCWNFSaEaFYicbqtYnXwPpSPEPws5nvOQLSmG4VWMibVAibdG6w/600?n=1">
      </div>
      <div>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
      </div>
    </cube-scroll>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import headerBar from '@components/header-bar'
import service from '@utils/service'
export default {
  data () {
    return {
      scrollEvents: ['scroll'],
      headerClass: ''
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created () {
    this._getUserMsg()
  },
  methods: {
    /**
     * 获取用户信息
     */
    async _getUserMsg () {
      const res = await service.get('/user/msg', {}, this.token)
      if (res.code === 0) {
        console.log(res.data)
      } else {
        if (this.token.length) {
          this.delete_token()
        } else {
          console.log(123)
        }
      }
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
    onScroll ({ y }) {
      if (-y >= 100) {
        this.headerClass = 'show'
      } else {
        this.headerClass = ''
      }
    },
    /**
     * vuex
     */
    ...mapMutations({
      'delete_token': 'DELETE_TOKEN'
    })
  },
  components: {
    headerBar,
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