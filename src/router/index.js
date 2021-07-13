import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    { path: '/home', component: home }
  ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to为目标路径，from为原路径，next为一个函数，表示放行
  //next() 放行   next('/login')强制跳转
  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router