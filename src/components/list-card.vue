<template>
  <div class="list-card">
    <img src="https://wecircle-1258512819.cos.ap-beijing.myqcloud.com/imgs/1572141543687-608248.jpeg"
         class="avatar">
    <div class="container">
      <p class="nickname">{{card.nickname}}</p>
      <p class="content"
         :class="{close:overFlag}"
         ref="content">{{card.content}}</p>
      <p class="over-tip"
         @click="changeOpen"
         v-show="card.content.length>55">{{overText}}</p>
      <div class="card-img">
        <img :src="img"
             v-for="(img, index) in card.picList"
             :key="img"
             @click="handleImgsClick(index)"
             :class="card.picList.length===1?'imgOne':'img'">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      overText: '展开',
      overFlag: true,
      initialIndex: 0
    }
  },
  methods: {
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
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/myColor'
.list-card
  padding 15px 10px
  display flex
  flex-direction row
  .avatar
    width 44px
    height 44px
    border-radius 5px
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
</style>