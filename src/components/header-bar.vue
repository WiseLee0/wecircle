<template>
  <div class="header-bar"
       :class="headerClass">
    <p class="title">Wecircle</p>
    <i class="cubeic-camera"></i>
  </div>
</template>

<script>
export default {
  props: {
    headerClass: {
      type: String,
      default: ''
    }
  },
}
</script>

<style lang="stylus" scoped>
.header-bar
  height 57px
  position fixed
  width 100%
  transition all 400ms
  z-index 100
  top 0
  left 0
  right 0
  .title
    text-align center
    font-size 18px
    line-height 24px
    font-weight bold
    margin-top 16px
    display none
    font-family 'Courier New', Courier, monospace
  .cubeic-camera
    font-size 24px
    position absolute
    right 17px
    top 16px
    color #fff
.header-bar::after
  display none
.header-bar.show::after
  background-color #ededed
  display block
.header-bar.show
  background-color #ededed
.header-bar.show .title
  display block
.header-bar.show .cubeic-camera
  color #000
</style>