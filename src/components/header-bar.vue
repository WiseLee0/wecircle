<template>
  <div class="header-bar border-bottom-1px"
       :class="headerClass">
    <p class="title">Wecircle</p>
    <i class="cubeic-camera"
       @click="toPublish"></i>
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
  methods: {
    toPublish () {
      this.$emit('toPublish')
    }
  },
}
</script>

<style lang="stylus" scoped>
.header-bar
  height 57px
  position fixed
  width 100%
  transition all 0.4s
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
    right 12px
    top 11px
    color #fff
    padding 5px
    border-radius 50%
    background-color rgba(255, 255, 255, 0.2)
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
  background-color rgba(0, 0, 0, 0.1)
</style>