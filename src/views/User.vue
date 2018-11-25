<template>
  <div>
      用户
      <pre>
          {{userInfo}}
      </pre>
  </div>
</template>

<script>
export default {
  name: 'User',
  data () {
    return {
      userInfo: this.$store.getters.userInfo
    }
  },
  created () {
    console.log(this.$store.getters.userInfo)
  }
}
</script>

<style scoped>

</style>
