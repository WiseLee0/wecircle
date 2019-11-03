<template>
  <div class="login">
    <!-- 左边返回 -->
    <div class="back-left"
         @click="back">
      <i class="cubeic-back"></i>
    </div>
    <!-- 中部登录 -->
    <div class="box-center">
      <h1 class="title">WELCOME TO WECIRCLE</h1>
      <div class="from">
        <cube-validator :model="phone"
                        :rules="rulePhone"
                        v-model="validatePhone"
                        class="validator-input">
          <cube-input v-model="phone"
                      :maxlength=11
                      placeholder="请输入手机号"
                      class="input">
          </cube-input>
        </cube-validator>
        <cube-validator :model="code"
                        :rules="ruleCode"
                        v-model="validateCode"
                        class="validator-input"
                        ref="validatorCode">
          <cube-input v-model="code"
                      :maxlength=6
                      placeholder="请输入验证码"
                      class="input">
            <cube-button :inline="true"
                         slot="append"
                         class="code"
                         v-show="timeCode===60"
                         @click="getCode">获取验证码</cube-button>
            <cube-button :inline="true"
                         slot="append"
                         :outline="true"
                         class="code-time"
                         v-show="timeCode!==60">{{timeCode}}S</cube-button>
          </cube-input>
        </cube-validator>
      </div>
      <cube-button class="btn"
                   @click="signIn">sign in</cube-button>
    </div>
    <!-- 右边标签 -->
    <div class="label-right"></div>
    <!-- 背景颜色 -->
    <div class="bgc-row"></div>
  </div>
</template>

<script>
import service from '@utils/service'
import axios from 'axios'
import { mapMutations } from "vuex"

export default {
  data () {
    return {
      phone: '',
      code: '',
      timeCode: 60,
      validatePhone: undefined,
      validateCode: undefined,
      rulePhone: {
        required: true,
        type: 'tel'
      },
      ruleCode: {
        required: true,
        type: 'number',
        len: 6
      }
    }
  },
  methods: {
    /**
     * 获取验证码
     */
    async getCode () {
      if (!this.validatePhone) return
      this._countTimeCode()
      const toast = this.$createToast({
        time: 0,
        txt: '正在发送中~~'
      })
      toast.show()
      // 发送请求
      const res = await service.get('/user/verifyCode', {
        phone: this.phone
      })
      toast.hide()

      this._toast(res, '验证码发送')
    },
    /**
     * 登录 
    */
    async signIn () {
      if (!(this.validatePhone && this.validateCode)) return
      const toast = this.$createToast({
        time: 0,
        txt: '正在登录中~~'
      })
      toast.show()
      const avatarUrl = await axios.get('https://wiselee.cn/musicApi/personalized?limit=2')
      const res = await service.post('/user/register', {
        phone: this.phone,
        code: this.code,
        avatar: avatarUrl.data.result[0].picUrl || '',
        bgUrl: avatarUrl.data.result[1].picUrl || ''
      })
      this._getUserMsg(res.token)
      toast.hide()
      this._toast(res, '登录')
      if (res.code !== 0) return
      setTimeout(() => {
        this.$router.push({
          path: '/wecircle'
        })
      }, 500)
    },
    /**
     * 返回主页面
     */
    back () {
      this.$router.backFlag = true
      this.$router.back()
    },
    /**
     *  倒计时
    */
    _countTimeCode () {
      this.clearFlag = setInterval(() => {
        if (this.timeCode == 0) {
          this.timeCode = 60
          clearInterval(this.clearFlag)
          return
        }
        this.timeCode--
      }, 1000)
    },
    /**
     * 校验结果显示toast
     */
    _toast (res, msg = '') {
      let txt = ''
      let type = ''
      if (res.code === 0) {
        txt = msg + '成功'
        type = 'correct'
      } else {
        txt = msg + '失败'
        type = 'error'
      }
      const toast = this.$createToast({
        time: 500,
        type,
        txt
      })
      toast.show()
    },
    /**
     * 获取用户信息,存储vuex
     */
    async _getUserMsg (token) {
      const res = await service.get('/user/msg', {}, token)
      this.set_user(res.data)
      this.set_token(token)
    },
    ...mapMutations({
      'set_token': 'SET_TOKEN',
      'set_user': 'SET_USER'
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/myColor'
.login
  position fixed
  top 0
  left 0
  bottom 0
  right 0
  display flex
  flex-direction row
  border-radius 10px
  background-color rgba(123, 182, 144, 0.07)
  overflow hidden
  .back-left
    position relative
    background-color $theme
    width 60px
    height 80px
    border-bottom-right-radius 40%
    .cubeic-back
      position absolute
      bottom 24px
      right 25px
      font-size 16px
      color #fff
  .box-center
    flex 1
    padding 20% 0 10% 20px
    display flex
    flex-direction column
    justify-content space-around
    .title
      font-weight normal
      font-family 'Courier New', Courier, monospace
      font-size 32px
      line-height 48px
    .from
      .validator-input
        width 90%
        margin 20px auto
        .code
          background-color $theme
          margin-right 10px
          border-radius 5px
        .code-time
          margin-right 10px
          border 10px
          color $font-gray
    .btn
      background linear-gradient(90deg, rgb(123, 182, 144), $theme)
      color rgb(255, 255, 255)
      font-size 22px
      border-top-left-radius 5.333vw
      height 13.333vw
      transform translateX(20px)
      font-family 'Courier New', Courier, monospace
  .label-right
    width 7px
    height 100%
    background-color $theme
    z-index 5
  .bgc-row
    position absolute
    top 25%
    left 0
    bottom 25%
    right 0
    background-color #fff
    z-index -1
</style>