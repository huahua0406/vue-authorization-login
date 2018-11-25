<template>
  <div id="app">
    <div style="line-height:50px;">
        <router-link to="/home">Home</router-link>
        <router-link to="/list">List</router-link>
        <router-link to="/user">User</router-link>
    </div>
    <hr>
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
}
</style>
