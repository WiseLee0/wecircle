<template>
  <div>
    <transition :enter-active-class="transitionNameIn"
                :leave-active-class="transitionNameOut"
                :duration="duration">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      transitionNameOut: '',
      transitionNameIn: '',
      duration: ''
    }
  },
  watch: {// 使用watch 监听$router的变化
    $route () {
      // 持续时间
      this.duration = 500
      // 后退
      if (this.$router.backFlag) {
        this.transitionNameOut = 'animated faster slideOutRight'
        this.transitionNameIn = 'animated faster slideInLeft'
      } else { // 前进
        this.transitionNameIn = 'animated faster slideInRight'
        this.transitionNameOut = 'animated faster slideOutLeft'
      }
      //重置返回的标志位
      this.$router.backFlag = false
    }
  }
}
</script>

<style lang="stylus" scoped></style>