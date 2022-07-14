<template>
  <el-dialog
    title="数据信息"
    :visible.sync="dialogVisible"
    width="70%"
  >
    <el-alert
      title="使用说明"
      type="warning"
      description="以下信息可以被存储起来，方便下一次加载"
      show-icon
      close-text="知道了"
    >
    </el-alert>
    <br/>
    <!--一个高亮显示的插件-->
    <codemirror
      :value="jsonData"
      :options="options"
      class="code"
    />
  </el-dialog>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import { codemirror } from 'vue-codemirror'
require('codemirror/mode/javascript/javascript.js')
export default {
  props: {
    data: Object
  },
  data() {
    return {
      dialogVisible: false,
      jsonData: {},
      options: {
        mode: { name: 'javascript', json: true },
        lineNumbers: true
      }
    }
  },
  components: {
    codemirror
  },
  methods: {
    init() {
      this.dialogVisible = true;
      this.jsonData = JSON.stringify(this.data, null, 4).toString();
    }
  }
}
</script>
