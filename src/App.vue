<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
/* 解决element-ui的table表格控件表头与内容列不对齐问题 */
.el-table th.gutter {
  display: table-cell !important;
}

/* 对调确认框的按钮位置*/
.el-message-box__btns {
  text-align: right;

  .el-button:nth-child(1) {
    float: right;
    margin-right: 5px;
  }

  .el-button:nth-child(2) {
    float: right;
    margin-right: 5px;
  }
}
</style>
