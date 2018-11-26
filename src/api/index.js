/**
 * api接口的统一管理
 */

import axios from '@/utils/http' // 导入http中创建的axios实例

// 导出接口
export default {
  getWxAuth (params) {
    return axios.get(`/get_wxauth`, {
      params: params
    })
  },
  getUserInfo (data) {
    return axios.post(`/get_user_info`, data)
  }
}
