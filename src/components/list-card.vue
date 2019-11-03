<template>
  <div class="list-card border-bottom-1px"
       @click="closeTip">
    <div class="avatar"
         v-show="card.vip === 1">
      <img v-lazy="card.avatar"
           class="avatarImg">
      <img src="./img/avatar.png"
           class="bgcImg"
           @click="toPerson(card.nickname,card.uid)">
    </div>
    <img v-lazy="card.avatar"
         class="avatarImg"
         v-show="card.vip !== 1"
         @click="toPerson(card.nickname,card.uid)">
    <div class="container">
      <p class="nickname">{{card.nickname}}</p>
      <p class="content"
         :class="{close:overFlag}"
         ref="content">{{card.content}}</p>
      <p class="over-tip"
         @click="changeOpen"
         v-show="card.content.length>55">{{overText}}</p>
      <div class="card-img">
        <img v-lazy="img"
             v-for="(img, index) in card.picList"
             :key="img"
             @click="handleImgsClick(index)"
             :class="card.picList.length===1?'imgOne':'img'">
      </div>
      <div class="msg-tip">
        <span class="msg-time">{{leaveNow}}</span>
        <cube-tip ref="tip"
                  direction="right"
                  style="right:60px;"
                  class="tip"
                  @click="$refs.tip.show()">
          <div class="tip-box">
            <div class="tip-like"
                 @click.stop="onLike">
              <i class="cubeic-like icon"
                 :style="likeFlag?'color:pink':'color:rgba(255, 255, 255, 0.5)'"></i>
              <span v-show="!likeFlag">赞</span>
              <span v-show="likeFlag"
                    style="color:pink">取消</span>
            </div>
            <div class="line border-right-1px"></div>
            <div class="tip-comment"
                 @click.stop="onComment">
              <i class="cubeic-message icon"></i>评论
            </div>
          </div>
        </cube-tip>
        <i class="cubeic-more"
           @click.stop="showTip"></i>
      </div>
      <div class="comment-list">
        <div class="like-content"
             v-show="card.like.length">
          <i class="cubeic-like"></i>
          <span class="like-nickname"
                v-for="(likeName,index) in card.like"
                :key="likeName">{{likeName}}<span v-show="card.like.length!==1 && index < card.like.length-1">, </span>
          </span>

        </div>
        <div class="comment-item border-top-1px"
             v-show="card.comment.length">
          <div v-for="commentItem in card.comment"
               :key="commentItem.id">
            <div class="comment-nickname">{{commentItem.nickname}}</div>
            <div>{{commentItem.comment}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@utils/service'
import { mapGetters, mapMutations } from 'vuex'
export default {
  props: {
    card: {
      type: Object,
      default: () => { }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    leaveNow () {
      var mistiming = Math.round((Date.now() - new Date(this.card.created_at)) / 1000)
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
    ...mapGetters(['token', 'user'])
  },
  data () {
    return {
      overText: '展开',
      overFlag: true,
      tipFlag: false,
      initialIndex: 0,
      likeFlag: false
    }
  },
  methods: {
    /**
     * 点击头像后的用户信息
     */
    async toPerson (nickname, uid) {
      if (nickname === this.user.nickname) return
      const res = await service.get(`/user/${uid}`)
      if (res.code === 0) this.set_person(res.data)
      this.$router.push({
        path: '/personpage'
      })
    },
    /**
     * 溢出文字展开收起
     */
    changeOpen () {
      if (this.overFlag) this.overText = '收起'
      else this.overText = '展开'
      this.overFlag = !this.overFlag
    },
    /**
     * 图片预览
     */
    handleImgsClick (index) {
      this.initialIndex = index
      const params = {
        $props: {
          imgs: this.card.picList,
          initialIndex: 'initialIndex',
          loop: false
        },
        $events: {
          change: (i) => {
            this.initialIndex = i
          }
        }
      }
      this.$createImagePreview({ ...params }).show()
    },
    /**
     * 点赞
     */
    async onLike () {
      if (!this.likeFlag) {
        await service.post('/like', {
          articleId: this.card.id
        }, this.token)
        this.set_like({
          index: this.index,
          nickname: this.user.nickname
        })
      } else {
        await service.post('/dislike', {
          articleId: this.card.id
        }, this.token)
        this.set_dislike({
          index: this.index,
          nickname: this.user.nickname
        })
      }
      this.likeFlag = !this.likeFlag
      this.closeTip()
    },
    /**
     * 评论
     */
    onComment () {
      this.$createDialog({
        type: 'prompt',
        title: '',
        icon: 'cubeic-message',
        prompt: {
          value: '',
          maxlength: 45,
          placeholder: '请输入短评内容'
        },
        confirmBtn: {
          text: '评论'
        },
        onConfirm: (e, comment) => {
          if (comment.length) {
            service.post('/comment', {
              articleId: this.card.id,
              comment
            }, this.token)
            this.set_comment({
              comment,
              nickname: this.user.nickname,
              index: this.index
            })
          }
        }
      }).show()
      this.closeTip()
    },
    /**
     * 展开tip
     */
    showTip () {
      if (!this.token.length) {
        this.$router.push({
          path: '/login'
        })
        return
      }
      this.card.like.forEach(item => {
        if (item === this.user.nickname) this.likeFlag = true
        else this.likeFlag = false
      })
      if (this.tipFlag) this.$refs.tip.hide()
      else this.$refs.tip.show()
      this.tipFlag = !this.tipFlag
    },
    closeTip () {
      this.$refs.tip.hide()
      this.tipFlag = false
    },
    ...mapMutations({
      'set_like': "SET_LIKE",
      'set_dislike': "SET_DISLIKE",
      'set_comment': "SET_COMMENT",
      'set_person': "SET_PERSON"
    })
  }
}
</script>

<style lang="stylus">
@import '~@/myColor'
.list-card
  padding 15px 10px
  display flex
  flex-direction row
  .avatarImg
    width 44px
    height 44px
    border-radius 5px
  .avatar
    width 60px
    height 60px
    display flex
    align-items center
    justify-content center
    position relative
    .bgcImg
      position absolute
      top -5px
      left -5px
      width 70px
      height 70px
  .container
    flex 1
    padding-left 10px
    .nickname
      text-align left
      font-size 17px
      line-height 27px
      color $theme
      max-width 53.333vw
      font-weight 500
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      font-family 'Courier New', Courier, monospace
    .content
      font-size 16px
      line-height 25px
      overflow hidden
      transition all 0.5s
      margin-top 12px
      color $theme-font
      font-family 'Courier New', Courier, monospace
      &.close
        display -webkit-box
        -webkit-box-orient vertical
        -webkit-line-clamp 3
        overflow hidden
    .over-tip
      font-size 14px
      line-height 16px
      color $theme
      padding-top 10px
      padding-right 10px
      text-align right
    .card-img
      margin-top 12px
      .img
        width 90px
        height 90px
        margin-right 4px
        margin-bottom 4px
      .imgOne
        max-width 200px
        max-height 200px
    .msg-tip
      padding-top 10px
      display flex
      flex-direction row
      justify-content space-between
      height 24px
      align-items center
      .msg-time
        font-size 14px
        color $font-gray
        font-family 'Courier New', Courier, monospace
      .tip
        padding 5px 5px 5px 0
        .cube-tip-close
          display none
        .tip-box
          width 160px
          height 20px
          display flex
          flex-direction row
          .line
            width 2px
            height 20px
          .tip-like, .tip-comment
            width 79px
            height 20px
            font-size 14px
            font-family 'Courier New', Courier, monospace
            line-height 20px
            text-align center
          .icon
            color rgba(255, 255, 255, 0.5)
            margin-right 5px
      .cubeic-more
        font-size 22px
        padding 0 10px
        border-radius 25px
        background-color #f7f7f7
    .comment-list
      font-size 14px
      background-color rgb(243, 243, 243)
      margin-top 9px
      margin-bottom 5px
      position relative
      .like-content
        padding-top 5px
        padding-bottom 8px
        padding-left 8px
        padding-right 8px
        text-align left
        word-break break-all
        .cubeic-like
          margin-right 4px
          margin-top 4px
          font-size 14px
          color pink
        .like-nickname
          color rgb(87, 107, 149)
          font-weight 500
      .comment-item
        padding 3px 5px 3px 8px
        text-align left
        word-break break-word
        min-height 24px
        line-height 18px
        .comment-nickname
          color rgb(87, 107, 149)
          max-width 130px
          float left
          font-weight 500
          margin-right 5px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
    .comment-list::before
      content ''
      position absolute
      left 8px
      top -9px
      width 0
      height 0
      border-right 5px solid transparent
      border-left 5px solid transparent
      border-bottom 10px solid rgb(243, 243, 243)
</style>