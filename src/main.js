import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/animate.css'
import 'amfe-flexible'
import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client'
import service from '@/utils/service'
import VueLazyLoad from 'vue-lazyload'
Vue.config.productionTip = false
Vue.use(VueSocketio, socketio(service.baseURL))
Vue.use(VueLazyLoad, {
  loading: require('./assets/default.png'),
  error: require('./assets/default.png')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
