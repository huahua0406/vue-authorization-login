import Vue from 'vue'
import Vuex from 'vuex'

// 开发模式下使用日志，和谷歌浏览器里面的vuedevtool插件类似
// 修改state的时候会在控制台打印一些信息
import createLogger from 'vuex/dist/logger'

import api from '../api'
const { getUserInfo } = api

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
  mutations: {
    setUserInfo (state, info) {
      state.userInfo = info
    }
  },
  actions: {
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo().then(res => {
            const data = res.data
            commit('setUserInfo', data)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
