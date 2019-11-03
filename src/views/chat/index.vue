<template>
  <div class="chat">
    <div class="header border-bottom-1px">
      <i class="cubeic-back"
         @click="back"></i>
      <p class="label">{{person.nickname}}</p>
    </div>
    <div class="container">
      <cube-scroll ref="scroll"
                   :options="options"
                   :data="chats">
        <div v-for="item in chats"
             :key="item.id">
          <chat-item :data="item"></chat-item>
        </div>
        <div ref="bottom"
             style="padding:10px 0"></div>
      </cube-scroll>
    </div>
    <div class="bottom-input border-top-1px">
      <cube-input v-model="content"
                  placeholder="输入内容"></cube-input>
      <div class="pic-box">
        <i class="cubeic-picture"></i>
        <cube-upload ref="upload"
                     v-model="files"
                     :max="1"
                     :action="action"
                     @files-added="filesAdded"
                     @file-submitted="fileSubmitted"
                     @file-success="fileSuccess"
                     :process-file="processFile">
          <cube-upload-btn :multiple="false">
          </cube-upload-btn>
        </cube-upload>
      </div>
      <cube-button :primary="true"
                   :inline="true"
                   @click="send">发送</cube-button>
    </div>
  </div>
</template>

<script>
import chatItem from '@components/chat-item'
import service from '@utils/service'
import { ImgMixin } from '@utils/mixin'
import { mapGetters } from 'vuex'
export default {
  mixins: [ImgMixin],
  data () {
    return {
      content: '',
      options: {
        bounce: false
      },
      files: [],
      action: {
        target: service.baseURL + '/publish/image',
        prop: 'base64Value'
      },
      chats: []
    }
  },
  computed: {
    ...mapGetters(['token', 'person', 'user'])
  },
  created () {
    this._getChat()
  },
  methods: {
    /**
     * 获取数据
     */
    async _getChat () {
      this.$socket.emit('login', this.user.id)
      const res = await service.get('/chat', {
        toUser: this.person.id
      }, this.token)
      this.chats = this._formatData(res)
      setTimeout(() => {
        this.$refs.scroll.scrollToElement(this.$refs.bottom, 1000)
      }, 20)
    },
    /**
     * 发送消息
     */
    async  send () {
      if (!this.content.length) return
      await service.post('/message', {
        content: this.content,
        toUser: this.person.id,
        pic: '',
        nickname: this.user.nickname,
        avatar: this.user.avatar
      }, this.token)
      this.chats.push({
        isContent: true,
        content: this.content,
        avatar: this.user.avatar,
        nickname: this.user.nickname,
        mine: true,
        pic: ''
      })
      this.content = ''
      setTimeout(() => {
        this.$refs.scroll.scrollToElement(this.$refs.bottom, 20)
      }, 20)
    },
    /**
     * 返回
     */
    back () {
      this.$router.back()
    },
    /**
     * 格式化数据
     */
    _formatData (chat) {
      let chats = []
      chat.forEach(element => {
        let obj = {}
        if (element.content.length)
          obj.isContent = true
        else obj.isContent = false
        if (element.toUser === this.person.id) {
          obj.mine = true
          obj.avatar = this.user.avatar
          obj.nickname = this.user.nickname
        }
        else {
          obj.mine = false
          obj.avatar = this.person.avatar
          obj.nickname = this.person.nickname
        }
        obj.content = element.content
        obj.pic = element.pic
        chats.unshift(obj)
      })
      return chats
    },
    /**
    * 返回图片地址
    */
    async fileSuccess (file) {
      const pic = 'https://' + file.response
      this.files = []
      await service.post('/message', {
        content: '',
        toUser: this.person.id,
        pic
      }, this.token)
      this.chats.push({
        isContent: false,
        content: '',
        avatar: this.user.avatar,
        nickname: this.user.nickname,
        mine: true,
        pic
      })
      setTimeout(() => {
        this.$refs.scroll.scrollToElement(this.$refs.bottom, 1000)
      }, 20)
    },
    /**
     * 实现文件过滤
     */
    filesAdded (files) {
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
  },
  sockets: {
    /**
    * 接收到消息
    */
    recieveMsg: function (res) {
      //将接收到的消息push到当前的list中
      const obj = {}
      if (res.content.length)
        obj.isContent = true
      else obj.isContent = false
      if (res.toUser === this.person.id) {
        obj.mine = true
        obj.avatar = this.user.avatar
        obj.nickname = this.user.nickname
      }
      else {
        obj.mine = false
        obj.avatar = this.person.avatar
        obj.nickname = this.person.nickname
      }
      obj.content = res.content
      obj.pic = res.pic
      this.chats.push(obj)
      setTimeout(() => {
        this.$refs.scroll.scrollToElement(this.$refs.bottom, 1000)
      }, 20)
    }
  },
  beforeDestroy () {
    this.$socket.emit('loginout', this.user.id)
  },
  components: {
    chatItem,
  },
}
</script>

<style lang="stylus">
@import '~@/myColor'
.chat
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
    background-color #e5e5e5
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
  .container
    position absolute
    top 60px
    bottom 60px
    left 0
    right 0
  .bottom-input
    position absolute
    bottom 0
    left 0
    right 0
    height 60px
    padding 0 10px
    background-color #e5e5e5
    display flex
    flex-direction row
    justify-content space-evenly
    align-items center
    .cube-input
      height 40px
      flex 1
    .pic-box
      position relative
      .cubeic-picture
        font-size 40px
        color $theme
        margin 0 5px
      .cube-upload
        width 30px
        height 30px
        opacity 0
        position absolute
        top 10px
        left 10px
        .cube-upload-btn-def
          width 30px
          height 30px
    .cube-btn-primary
      width 44px
      height 30px
      background $theme
</style>