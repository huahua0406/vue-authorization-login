import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/author',
      name: 'Author',
      meta: {
        title: 'Author'
      },
      component: () => import('@/views/Author')
    },
    {
      path: '/home',
      name: 'Home',
      meta: {
        title: 'Home'
      },
      component: () => import('@/views/Home')
    },
    {
      path: '/user',
      name: 'User',
      meta: {
        title: 'User'
      },
      component: () => import('@/views/User')
    },
    {
      path: '/list',
      name: 'List',
      meta: {
        title: 'List'
      },
      component: () => import('@/views/List')
    }
  ]
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  document.title = to.meta.title
  // 第一次访问
  const token = window.localStorage.getItem('token')

  if (!token && to.path !== '/author') {
    // 保存用户进入的url
    console.log(to.fullPath)
    window.localStorage.setItem('beforeLoginUrl', to.fullPath)
    next('/author')
  } else if (token && !store.getters.userInfo) {
    // 拉取用户信息
    store.dispatch('getUserInfo').catch(err => {
      console.log(err)
      window.localStorage.removeItem('token')
      router.go(0)
    })
    next()
  } else {
    // 已经登录
    next()
  }
})

export default router
