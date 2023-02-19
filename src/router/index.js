import { createRouter, createWebHashHistory } from 'vue-router'
import VueShopLogin from '../components/Login.vue'
import VueShopHome from '../components/Home.vue'
import VueShopWelcome from '../components/Welcome.vue'
import VueShopUsers from '../components/user/Users.vue'
import VueShopAuth from '../components/auth/Auth.vue'
import VueShopRoles from '../components/auth/Roles.vue'
import VueShopCategory from '../components/goods/Category.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [

    {
      path: '/home',
      redirect: '/welcome',
      component: VueShopHome,
      children: [
        {
          path: '/welcome',
          component: VueShopWelcome
        },
        {
          path: '/users',
          component: VueShopUsers
        },
        {
          path: '/rights',
          component: VueShopAuth
        },
        {
          path: '/roles',
          component: VueShopRoles
        },
        {
          path: '/categories',
          component: VueShopCategory
        }
      ]
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
