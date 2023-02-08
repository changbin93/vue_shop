import { createRouter, createWebHashHistory } from 'vue-router'
import VueShopLogin from '../components/Login.vue'
import VueShopHome from '../components/Home.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/home',
      component: VueShopHome
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: VueShopLogin
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路劲跳转而来
  // next 是一个函数 表示放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
