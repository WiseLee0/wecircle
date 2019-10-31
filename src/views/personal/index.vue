<template>
  <div class="personal">
    <div class="header">
      <i class="cubeic-back"
         @click="back"></i>
      <p class="label">个人中心</p>
    </div>
    <cube-upload ref="upload"
                 v-model="files"
                 :max="1"
                 :action="action"
                 @files-added="filesAdded"
                 @file-submitted="fileSubmitted"
                 @file-success="fileSuccess"
                 :process-file="processFile"
                 class="personal-row border-bottom-1px">
      <span>头像</span>
      <div class="right">
        <img :src="user.avatar"
             class="avatar-img">
        <i class="cubeic-arrow"></i>
      </div>
      <cube-upload-btn :multiple="false">
      </cube-upload-btn>
    </cube-upload>
    <div class="personal-row border-bottom-1px"
         @click="onNickName">
      <span>名字</span>
      <div>
        <span style="color:#9a9e9e">{{user.nickname}}</span>
        <i class="cubeic-arrow"></i>
      </div>
    </div>
    <div class="personal-row border-bottom-1px">
      <span>性别</span>
      <div>
        <span style="color:#9a9e9e">{{user.gender}}</span>
        <i class="cubeic-arrow"></i>
      </div>
      <cube-select v-model="gender"
                   :options="options"
                   @input="onGender">
      </cube-select>
    </div>
    <div class="personal-row border-bottom-1px"
         @click="onDesc">
      <span class="desc-label">个性签名</span>
      <div>
        <span style="color:#9a9e9e">{{user.desc}}</span>
      </div>
    </div>
    <div class="personal-row border-bottom-1px">
      <span>电话号码</span>
      <div>
        <span style="color:#9a9e9e">{{user.phone}}</span>
        <i class="cubeic-arrow"></i>
      </div>
    </div>
    <div class="chat personal-row border-bottom-1px border-top-1px">
      <span>私信</span>
      <i class="cubeic-arrow"></i>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { ImgMixin } from '@utils/mixin'
import service from '@utils/service'
export default {
  mixins: [ImgMixin],
  computed: {
    ...mapGetters(['user', 'token'])
  },
  data () {
    return {
      files: [],
      action: {
        target: service.baseURL + '/publish/image',
        prop: 'base64Value'
      },
      showToast: null,
      gender: '男',
      options: ['男', '女'],
      nicknameFlag: false
    }
  },
  created () {
    this.gender = this.user.gender
  },
  methods: {
    /**
     * 修改用户名
     */
    onNickName () {
      if (this._toLogin()) return
      this.$createDialog({
        type: 'prompt',
        title: '',
        icon: 'cubeic-message',
        prompt: {
          value: this.user.nickname,
          maxlength: 15,
          placeholder: '请重置昵称'
        },
        confirmBtn: {
          text: '修改'
        },
        onConfirm: async (e, comment) => {
          if (comment.length) {
            this.set_user_attribute({
              attribute: 'nickname',
              key: comment
            })
            await service.post('/user/change', {
              nickname: comment
            }, this.token)
          }
        }
      }).show()
      this.nicknameFlag = true
    },
    /**
    * 修改个性签名
    */
    onDesc () {
      if (this._toLogin()) return
      this.$createDialog({
        type: 'prompt',
        title: '',
        icon: 'cubeic-message',
        prompt: {
          value: this.user.desc,
          maxlength: 30,
          placeholder: '请写下你的个性签名'
        },
        confirmBtn: {
          text: '修改'
        },
        onConfirm: async (e, comment) => {
          if (comment.length) {
            this.set_user_attribute({
              attribute: 'desc',
              key: comment
            })
            await service.post('/user/change', {
              desc: comment
            }, this.token)
          }
        }
      }).show()
    },
    /**
     * 修改性别
     */
    async onGender (key) {
      if (this._toLogin()) return
      await service.post('/user/change', {
        gender: key
      }, this.token)
      this.set_user_attribute({
        attribute: 'gender',
        key
      })
    },
    /**
    * 返回
    */
    async back () {
      if (this.files.length || this.nicknameFlag) {
        const data = await service.get('/publish/article/1')
        this.set_list(data)
      }
      this._getUserMsg()
      this.$router.back()
    },
    /**
    * 返回图片地址
    */
    async fileSuccess (file) {
      const avatar = 'https://' + file.response
      const res = await service.post('/user/change', {
        avatar
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
     * 获取用户信息
     */
    async _getUserMsg () {
      const msg = await service.get('/user/msg', {}, this.token)
      if (msg.code === 0) this.set_user(msg.data)
    },
    _toLogin () {
      if (!this.token.length) {
        this.$createToast({
          type: 'warn',
          time: 1000,
          txt: '未登录,请登录'
        }).show()
        setTimeout(() => {
          this.$router.push({
            path: '/login'
          })
        }, 1000)
        return true
      }
      return false
    },
    /**
     * 实现文件过滤
     */
    filesAdded (files) {
      if (this._toLogin()) return
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
    ...mapMutations({
      'set_user': "SET_USER",
      'set_list': 'SET_LIST',
      'set_user_attribute': 'SET_USER_ATTRIBUTE'
    })
  },
}
</script>

<style lang="stylus">
@import '~@/myColor'
.cubeic-arrow
  margin-left 10px
  font-size 14px
  color #c8c8cd
.personal
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  background-color $bgc-grey
  .header
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
  .personal-row
    padding 10px 15px
    background-color #fff
    font-size 17px
    line-height 24px
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    position relative
    .desc-label
      min-width 80px
  .chat
    position relative
    justify-content center
    margin-top 10px
    .cubeic-arrow
      position absolute
      right 15px
      top 10px
      font-size 14px
      color #c8c8cd
  .cube-upload
    position relative
    height 64px
    .right
      display flex
      justify-content center
      align-items center
      .avatar-img
        height 64px
        width 64px
    .cube-upload-btn
      position absolute
      top 10px
      left 15px
      right 15px
      bottom 10px
      opacity 0
  .cube-select
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    opacity 0
</style>