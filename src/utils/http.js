// 对axios的二次封装
import axios from 'axios' // 引入axios
import router from '@/router'
import Qs from 'qs' // 引入qs模块，用来序列化post类型的数据

// 创建axios实例
const instance = axios.create({
  timeout: 1000 * 10
})

// 环境切换
if (process.env.NODE_ENV === 'development') {
  instance.defaults.baseURL = '/apis' // 开发环境设置代理url:apis
//   instance.defaults.baseURL = 'http://127.0.0.1:3000'
} else if (process.env.NODE_ENV === 'debug') {
  instance.defaults.baseURL = 'https://www.test.com'
} else if (process.env.NODE_ENV === 'production') {
  instance.defaults.baseURL = 'https://www.production.com'
}

// 设置请求超时
instance.defaults.timeout = 10000
// POST请求头的设置
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // POST传参序列化
    if (config.method === 'post') {
      config.data = Qs.stringify(config.data)
    }
    // 若是有做鉴权token , 就给头部带上token
    if (window.localStorage.getItem('token')) {
      config.headers.Authorization = window.localStorage.getItem('token')
    }
    return config
  },
  error => {
    return Promise.reject(error)
  })

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录状态，跳转登录页
        case 401:
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
          break

          // 403 token过期 清除token并跳转登录页
        case 403:
        //   Message({
        //     duration: 2000,
        //     message: '登录过期，请重新登录',
        //     type: 'error'
        //   })
          // 清除token
          window.localStorage.removeItem('token')
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            router.replace({
              path: '/login',
              query: {
                redirect: router.currentRoute.fullPath
              }
            })
          }, 1000)
          break
          // 404请求不存在
        case 404:
        //   Message({
        //     duration: 2000,
        //     message: '请求不存在',
        //     type: 'error'
        //   })
          break
          // 其他错误，直接抛出错误提示
        default:
        //   Message({
        //     duration: 2000,
        //     message: error.response.data.message,
        //     type: 'error'
        //   })
      }
      return Promise.reject(error.response)
    }
  }
)

export default instance
