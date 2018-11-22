<template>
    <div>
        授权中...
    </div>
</template>

<script>
import { getQueryString } from '@/utils/utils'
export default {
  name: 'Author',
  data () {
    return {}
  },
  created () {
    // 判断链接有没有token参数，如果没有就跳微信授权，然后后台会重定向回来并携带token，如： www.xxxx.com/wx/author?token=xxxxxxxxx&msg=200
    if (!getQueryString('token')) {
      console.log('授权登录')
      this.returnGetCodeUrl()
    } else {
      console.log('登录成功')
      const msg = getQueryString('msg')
      if ((Number(msg) === 200)) {
        const token = getQueryString('token')
        // 存储token到本地
        window.localStorage.setItem('token', token)
        // 获取beforeLoginUrl 页面地址
        const url = window.localStorage.getItem('beforeLoginUrl')
        console.log(url, 555)
        // 跳转
        this.$router.replace(url)
        // 删除本地beforeLoginUrl
        window.localStorage.removeItem('beforeLoginUrl')
      } else {
        // msg不是200的情况,
        alert('授权失败请关闭网页重新进入')
      }
    }
  },
  methods: {
    async returnGetCodeUrl () {
      let { data } = await this.$api.getWxAuth()
      if (data.status === 200) {
        window.location.href = data.url
      }
    }
  }
}
</script>

<style scoped>
</style>
