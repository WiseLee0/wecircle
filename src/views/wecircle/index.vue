<template>
  <div class="wecircle">
    <header-bar :headerClass="headerClass"
                @toPublish="toPublish"></header-bar>
    <div ref="circleIcon"
         class="circle-icon">
      <div ref="circleIconInner"
           class="circle-icon-inner">
      </div>
    </div>
    <cube-scroll ref="scroll"
                 :data="list"
                 :options="options"
                 :scroll-events="scrollEvents"
                 @scroll="onScroll"
                 @pulling-up="onPullingUp">
      <cube-upload ref="upload"
                   v-model="files"
                   :max="1"
                   :action="action"
                   @files-added="filesAdded"
                   @file-submitted="fileSubmitted"
                   @file-success="fileSuccess"
                   :process-file="processFile">
        <img :src="user.bgUrl"
             class="bg-img border-bottom-1px"
             ref="bgImg">
        <cube-upload-btn :multiple="false"
                         class="mask">
        </cube-upload-btn>
      </cube-upload>
      <div class="name-info">
        <p class="nickname">{{user.nickname}}</p>
        <img class="avatar"
             :src="user.avatar"
             @click="toPersonal">
      </div>
      <div v-for="(card,index) in list"
           :key="card.id">
        <list-card :card="card"
                   :index="index"></list-card>
      </div>
    </cube-scroll>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import headerBar from '@components/header-bar'
import listCard from '@components/list-card'
import service from '@utils/service'
import { ImgMixin } from '@utils/mixin'
export default {
  mixins: [ImgMixin],
  data () {
    return {
      scrollEvents: ['scroll'],
      headerClass: '',
      options: {
        bounce: true,
        pullUpLoad: true
      },
      files: [],
      action: {
        target: service.baseURL + '/publish/image',
        prop: 'base64Value'
      },
      showToast: null,
      touch: {
        y: 0,
        percent: 0
      },
      circleFlag: true,
      getCount: 0,
      page_num: 1,
      limit: false
    }
  },
  computed: {
    ...mapGetters(['token', 'user', 'list'])
  },
  created () {
    this._getUserMsg()
    this.getList()
  },
  methods: {
    /**
     * 获取用户信息
     */
    async _getUserMsg () {
      if (this.token.length) {
        const res = await service.get('/user/msg', {}, this.token)
        if (res.code === 0) this.set_user(res.data)
        else
          // token 过期删除令牌
          if (this.token.length) this.delete_token()
      }
    },
    /**
     * 获取朋友圈动态
     */
    async getList () {
      const res = await service.get('/publish/article/' + this.page_num)
      this.set_list(res)
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
     * 个人中心
     */
    toPersonal () {
      this.$router.push({
        path: '/personal'
      })
    },
    // 上拉数据
    async onPullingUp () {
      const temp = this.list.length
      if (!this.limit) {
        this.page_num++
        const res = await service.get('/publish/article/' + this.page_num)
        this.set_concat_list(res)
      } else {
        this.$refs.scroll.forceUpdate()
      }
      if (temp + 6 !== this.list.length) {
        this.limit = true
      }
    },
    /**
    * 滚动事件
    */
    onScroll ({ y }) {
      if (-y < 0) {
        const translateY = y * 2
        let rotate = -y / 30 * 360
        if (this.circleFlag)
          this.$refs.circleIcon.style.webkitTransform = 'translate3d(0,' + translateY + 'px,0) rotate(' + rotate + 'deg)'
        if (translateY > 90 && this.circleFlag) {
          this.getCount++
          this.$refs.scroll.disable()
          this.circleFlag = false
          this.$refs.circleIconInner.classList.add('circle-rotate')
          // 700ms之后，动画结束，立刻收起
          setTimeout(() => {
            this.circleFlag = true
            this.$refs.circleIconInner.classList.remove('circle-rotate')
            this.$refs.circleIcon.style.webkitTransform = 'translate3d(0,0,0) rotate(0deg)'
            this.$refs.scroll.scrollTo(0, 0, 700)
            this.$refs.scroll.enable()
          }, 700)
        }
      }
      if (-y >= 150) this.headerClass = 'show'
      else this.headerClass = ''
      if (-y >= 57) this.$refs.bgImg.style.filter = 'blur(2px)'
      else this.$refs.bgImg.style.filter = 'blur(0px)'
    },
    /**
    * 返回图片地址
    */
    async fileSuccess (file) {
      const bgUrl = 'https://' + file.response
      const res = await service.post('/user/change', {
        bgUrl
      }, this.token)
      this.showToast.hide()
      if (res.code === 0) {
        this.showToast = this.$createToast({
          time: 1000,
          type: 'correct',
          txt: '更改成功'
        })
        this.showToast.show()
        this._getUserMsg()
      }
    },
    /**
    * 实现文件过滤
    */
    filesAdded (files) {
      this.showToast = this.$createToast({
        time: 0,
        txt: '正在修改中~~'
      })
      if (this.files[0] && this.files[0].status == 'success') {
        this.showToast.hide()
        this.showToast = this.$createToast({
          type: 'error',
          time: 1000,
          txt: '修改过了,以后在试~~'
        })
      }
      this.showToast.show()

      let hasIgnore = false
      let txt = ''
      const maxSize = 10 * 1024 * 1024
      for (let k in files) {
        const file = files[k]
        if (file.size > maxSize) {
          file.ignore = true
          hasIgnore = true
          txt = '图片太大~~'
        }
      }
      hasIgnore && this.$createToast({
        type: 'warn',
        time: 1000,
        txt
      }).show()
    },
    /**
     * vuex
     */
    ...mapMutations({
      'delete_token': 'DELETE_TOKEN',
      'set_user': 'SET_USER',
      'set_list': 'SET_LIST',
      'set_concat_list': 'SET_CONCAT_LIST'
    })
  },
  watch: {
    list () {
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    },
    getCount (to) {
      if (to === 2) {
        this.getCount = 0
        this.page_num = 1
        this.limit = false
        this.getList()
      }
    }
  },
  components: {
    headerBar,
    listCard
  },
}
</script>

<style lang="stylus">
@import '~@/myColor'
.wecircle
  position fixed
  left 0
  right 0
  top -50px
  bottom 0
  .circle-icon
    position absolute
    top 20px
    left 10px
    z-index 99
    .circle-icon-inner
      width 25px
      height 25px
      background-image url('./circle.png')
      background-size cover
  .circle-rotate
    animation xuzhuan 0.8s linear infinite
  @keyframes xuzhuan
    0%
      transform rotate(0deg)
    25%
      transform rotate(90deg)
    50%
      transform rotate(180deg)
    75%
      transform rotate(270deg)
    100%
      transform rotate(360deg)
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
    .cube-upload-btn-def
      opacity 0
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