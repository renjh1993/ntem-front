<template>
  <el-dialog title="流程配置" :visible.sync="visible" width="500px" destroy-on-close>
    <el-form ref="formData" v-loading="loading" :rules="rules" :model="formData" status-icon label-suffix=":">
      <el-form-item label="关联业务路由名" prop="businessRoute" label-width="150px">
        <el-input v-model.trim="formData.businessRoute" type="text" placeholder="请输入关联业务申请路由名" maxlength="30" show-word-limit />
      </el-form-item>
      <el-form-item label="关联表单组件名" prop="formName" label-width="150px">
        <el-input v-model.trim="formData.formName" type="text" placeholder="请输入关联业务表单组件名" maxlength="30" show-word-limit />
      </el-form-item>
      <el-form-item align="center">
        <el-button type="primary" size="mini" @click="submitForm('formData')">提交</el-button>
        <el-button size="mini" @click="visible=false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getProcessConfigByProcessKey, updateProcessConfig } from '@/api/workflow/definition'

export default {
  props: {
    processKey: String // 流程key
  },

  data() {
    return {
      visible: false, // 弹出窗口，true弹出
      loading: false,
      formData: {}, // 提交表单数据
      rules: {
        businessRoute: [
          { required: true, message: '请输入关联业务申请路由名', trigger: 'blur' }
        ],
        formName: [
          { required: true, message: '请输入关联业务表单组件名', trigger: 'blur' }
        ]
      }
    }
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.getByProcessKey()
      }
    }
  },

  methods: {
    // 查询流程配置
    async getByProcessKey() {
      try {
        this.loading = true
        const { data } = await getProcessConfigByProcessKey(this.processKey)
        this.formData = data || {}
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },

    // 提交表单数据
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          // 校验通过，提交表单数据
          this.loading = true
          try {
            this.formData.processKey = this.processKey
            const response = await updateProcessConfig(this.formData)
            console.log('====' + response.code)
            if (response.code === 200) {
              // 刷新数据
              // this.$parent.fetchData()
              this.$message.success('提交成功')
              // 将表单清空
              this.$refs['formData'].resetFields()
              // 关闭窗口
              this.visible = false
            }
            this.loading = false
          } catch (e) {
            this.loading = false
          }
        }
      })
    }

  }
}
</script>
