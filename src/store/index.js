import Vue from 'vue'
import Vuex from 'vuex'

// 开发模式下使用日志，和谷歌浏览器里面的vuedevtool插件类似
// 修改state的时候会在控制台打印一些信息
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 调试,开发模式开启严格模式，修改state必须使用mutations提交的方式
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    userInfo: null
  },
  getters: {
    userInfo: state => state.userInfo
  },
  mutations: {},
  actions: {},
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
