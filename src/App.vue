<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    font-family: "PingFang SC","Helvetica Neue",Helvetica,Arial,STHeiTi,"Microsoft YaHei",sans-serif;
    box-sizing: border-box;
}
html,body{
  height: 100%;
}
#app {
  height: 100%;
  text-align: center;
  margin-top: 60px;
}
</style>
