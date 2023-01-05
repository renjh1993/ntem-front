<template>
  <div>
    <el-badge :value="total">
      <img src="@/assets/logo/notice.png" class="svg-icon" @click="click">
    </el-badge>
  </div>
</template>

<script>

export default {
  name: 'Notice',
  props: {
    // message用于接收
    total: {
      type: Number, // 验证类型，也可以验证其他类型
      default: 0 // 如果父组件传值，则用父组件的值渲染，反之使用默认值
    }
  },
  data() {
    return {
      // total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    // this.init()
  },
  methods: {
    click() {
      this.$router.push('/workflowPersonal/personalWaiting')
    }
    // init() {
    //   api.getTaskWaitByPage(this.queryParams).then(response => {
    //       this.total = response.total;
    //   })
    // },
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1.2em;
  height: 1.25em;
  vertical-align: -0.25em;
  fill: currentColor;
  overflow: hidden;
}
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
