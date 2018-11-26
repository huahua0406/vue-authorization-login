// 对axios的二次封装
import axios from 'axios' // 引入axios
import Qs from 'qs' // 引入qs模块，用来序列化post类型的数据

// 创建axios实例
const instance = axios.create({
  timeout: 1000 * 10
})

// 环境切换
if (process.env.NODE_ENV === 'development') {
  // 开发环境设置代理 ==> apis
  // instance.defaults.baseURL = '/apis'
  instance.defaults.baseURL = 'http://127.0.0.1:3000'
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
    return Promise.reject(error)
  }
)

export default instance
