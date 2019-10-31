import Vue from 'vue'
import Router from 'vue-router'
const Login = (resolve) => {
  import('@views/login/index').then((module) => {
    resolve(module)
  })
}
const Publish = (resolve) => {
  import('@views/publish/index').then((module) => {
    resolve(module)
  })
}
const Wecircle = (resolve) => {
  import('@views/wecircle/index').then((module) => {
    resolve(module)
  })
}
const Personal = (resolve) => {
  import('@views/personal/index').then((module) => {
    resolve(module)
  })
}
Vue.use(Router)
export default new Router({
  routes: [{
    path: '/',
    redirect: '/wecircle'
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/publish',
    component: Publish
  }, {
    path: '/wecircle',
    component: Wecircle
  }, {
    path: '/personal',
    component: Personal
  }]
})