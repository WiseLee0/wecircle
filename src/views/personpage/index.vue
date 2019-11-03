<template>
  <div class="personpage">
    <div class="header">
      <i class="cubeic-back"
         @click="back"></i>
      <p class="label">用户信息</p>
    </div>
    <div class="personpage-row border-bottom-1px">
      <img :src="person.avatar"
           class="avatar"
           @click="showImagePreview">
      <div class="name-phone">
        <div class="name">
          <span>{{person.nickname}}</span>
          <i class="cubeic-person"
             :style="person.gender=='男'?'color:#47ae73':'color:pink'"></i>
        </div>
        <span class="phone">Phone: {{person.phone}}</span>
      </div>
    </div>
    <div class="personpage-desc border-bottom-1px">
      <span class="desc-label">个性签名</span>
      <span style="color:#9a9e9e">{{person.desc}}</span>
    </div>
    <div class="chatMessage personpage-desc border-bottom-1px border-top-1px"
         @click="toChat">
      <span>发消息</span>
      <i class="cubeic-arrow"></i>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['person', 'token'])
  },
  methods: {
    back () {
      this.$router.backFlag = true
      this.$router.back()
    },
    showImagePreview () {
      let avatar = []
      avatar.push(this.person.avatar)
      this.$createImagePreview({
        imgs: avatar
      }).show()
    },
    toChat () {
      if (!this.token.length) {
        this.$router.push({
          path: '/login'
        })
        return
      }
      this.$router.push({
        path: '/personpage/chat'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/myColor'
.personpage
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
  .personpage-row
    padding 10px 15px
    background-color #fff
    font-size 17px
    line-height 24px
    display flex
    flex-direction row
    align-items center
    .avatar
      width 65px
      height 65px
      border-radius 8px
    .name-phone
      margin-left 20px
      display flex
      flex-direction column
      .name
        font-size 18px
        font-weight 700
        line-height 24px
        .cubeic-person
          margin-left 5px
          font-size 14px
          line-height 24px
      .phone
        font-size 14px
        color $font
  .personpage-desc
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
  .chatMessage
    position relative
    justify-content center
    margin-top 10px
    .cubeic-arrow
      position absolute
      right 15px
      top 10px
      font-size 14px
      color #c8c8cd
</style>