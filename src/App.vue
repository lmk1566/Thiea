<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue';
export default {
  name: 'app'
};
</script>

<style>
body {
  padding: 0px;
  margin: 0px auto;
}

/*element-ui的table表格控件表头与内容列不对齐问题*/
body .el-table th.gutter{
  display: table-cell!important;
}
/*element-ui的table表格控件表头与内容列不对齐问题*/

a {
  text-decoration: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
</style>
