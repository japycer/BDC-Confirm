import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入组件
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcom.vue'
import FdcqUI from '../views/confirm/FdcqUI.vue'
import QlrUI from '../views/confirm/QlrUI.vue'
import ZszmUI from '../views/confirm/ZszmUI.vue'
import HUI from '../views/confirm/HUI.vue'
import StatRemain from '../views/stat/StatRemain.vue'
import StatToday from '../views/stat/StatToday.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/fdcq2', component: FdcqUI },
      { path: '/qlr', component: QlrUI },
      { path: '/zszm', component: ZszmUI },
      { path: '/h', component: HUI },
      { path: '/remain', component: StatRemain },
      { path: '/stat-today', component: StatToday },
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('./login')
  next()
})
export default router
