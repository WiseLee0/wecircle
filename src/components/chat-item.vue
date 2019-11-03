<template>
  <div :class="data.mine ? 'chat-item chat-item-mine':'chat-item'">
    <img class="avatar"
         v-lazy="data.avatar" />
    <div class="right-content">
      <p class="nickname">{{data.nickname}}</p>
      <div class="chat-text left-arrow"
           v-if="data.isContent">{{data.content}}</div>
      <img class="chat-image"
           v-if="!data.isContent"
           v-lazy="data.pic"
           @click="selectImg" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => { }
    },
  },
  methods: {
    selectImg () {
      let imgs = []
      imgs.push(this.data.pic)
      this.$createImagePreview({
        imgs
      }).show()
    }
  },
}
</script>

<style lang="stylus" scoped>
.chat-item
  display flex
  margin-top 20px
  .avatar
    width 45px
    height 45px
    border-radius 4px
    margin-left 12px
    margin-right 12px
  .right-content
    flex 1
    display flex
    flex-direction column
    align-items flex-start
    .nickname
      color rgb(103, 103, 103)
      font-size 14px
      text-align left
      max-width 143px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
    .chat-text
      color rgb(15, 15, 15)
      background-color #fff
      text-align left
      border-radius 4px
      font-size 16px
      line-height 20px
      position relative
      margin-top 5px
      padding 8px 12px
      box-sizing border-box
      max-width 200px
      word-break break-all
    .left-arrow::before
      content ''
      position absolute
      left -8px
      top 7px
      width 0
      height 0
      border-top 5px solid transparent
      border-bottom 5px solid transparent
      border-right 10px solid #fff
    .chat-image
      border 0.5px solid #ccc
      display block
      border-radius 3px
      margin-top 3px
      background-color #e9e9e9
      max-width 120px
      max-height 200px
.chat-item-mine
  flex-direction row-reverse
  .right-content
    display flex
    flex-direction column
    align-items flex-end
    .chat-text
      background-color #94eb68
    .left-arrow::after
      content ''
      position absolute
      width 0
      height 0
      top 7px
      right -8px
      left auto
      border-top 5px solid transparent
      border-bottom 5px solid transparent
      border-left 10px solid #94eb68
    .left-arrow::before
      display none
</style>