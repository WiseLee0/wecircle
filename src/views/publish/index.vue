<template>
  <div class="publish">
    <div class="top">
      <span class="cancel"
            @click="cancel">取消</span>
      <cube-button :primary="true"
                   :inline="true"
                   class="btn"
                   @click="toPublish">发表</cube-button>
    </div>
    <div class="middle">
      <cube-textarea v-model="content"
                     :maxlength="140"
                     placeholder="分享此时此刻。。。"
                     indicator="indicator"
                     :autoExpand="true"></cube-textarea>
    </div>
    <div class="bottom">
      <cube-upload ref="upload"
                   :max="9"
                   :action="action"
                   @files-added="filesAdded"
                   @file-submitted="fileSubmitted"
                   @file-success="fileSuccess"
                   :process-file="processFile"
                   :auto="false" />
    </div>
  </div>
</template>

<script>
import { ImgMixin } from '@utils/mixin'
import service from '@utils/service'
import { mapGetters, mapMutations } from 'vuex'
export default {
  mixins: [ImgMixin],
  data () {
    return {
      action: {
        target: service.baseURL + '/publish/image',
        prop: 'base64Value'
      },
      content: '',
      indicator: {
        negative: true,
        remain: false
      },
      picList: [],
      showToast: null
    }
  },
  computed: {
    ...mapGetters(['token', 'user'])
  },
  methods: {
    /** 
    * 发布动态
    */
    toPublish () {
      let txt = ''
      if (!this.content.length) txt = '需要输入内容'
      if (!this.$refs.upload.files.length) txt = '需要选择图片~~'
      if (txt.length) {
        const toast = this.$createToast({
          time: 500,
          txt
        })
        toast.show()
        return
      }
      this.showToast = this.$createToast({
        time: 0,
        txt: '正在发布中~~'
      })
      this.showToast.show()
      this.$refs.upload.start()
    },
    /**
     * 返回主页面
     */
    cancel () {
      this.$router.backFlag = true
      this.$router.back()
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
    /**
     * 返回图片地址，发布，跳转界面
     */
    async fileSuccess (file) {
      this.picList.push('https://' + file.response)
      if (this.$refs.upload.files.length === this.picList.length) {
        let res = await service.post('/publish', {
          content: this.content,
          picList: this.picList.toString(),
          avatar: this.user.avatar,
          nickname: this.user.nickname,
          vip: this.user.vip
        }, this.token)
        // 刷新vuex列表数据
        const data = await service.get('/publish/article/1')
        this.set_list(data)
        this.showToast.hide()
        this._toast(res, '发布')
        // 清除数据
        this._clearData()
        setTimeout(() => {
          this.$router.replace({
            path: '/wecircle'
          })
        }, 500);
      }
    },
    /**
     * 数据清空
     */
    _clearData () {
      this.content = ''
      this.picList = []
      this.$refs.upload.files = []
    },
    /**
     * 校验中，显示toast
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
    ...mapMutations({
      'set_list': 'SET_LIST'
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/myColor'
.publish
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  .top
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    width 100%
    height 65px
    margin 0 auto
    .cancel
      font-size 16px
      padding 15px
    .btn
      margin-right 15px
      background-color $theme
  .middle
    padding 15px
    .cube-textarea_expanded
      height 200px
  .bottom
    padding-left 15px
</style>