<template>
  <div>
    <div>
      <h2>{{ processInstName }}</h2>
      <el-form label-width="80px">
        <el-form-item label="主键id">
          <el-input v-model="form.id" readonly />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" readonly />
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model="form.reason" readonly />
        </el-form-item>
        <el-form-item label="天数">
          <el-input v-model="form.days" readonly />
        </el-form-item>
        <el-form-item label="钱数">
          <el-input v-model="form.money" readonly />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="form.crtuser" readonly />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="form.crtdate" readonly />
        </el-form-item>
        <el-form-item label="更新人">
          <el-input v-model="form.upduser" readonly />
        </el-form-item>
        <el-form-item label="更新时间">
          <el-input v-model="form.upddate" readonly />
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button v-if="isApproval" :loading="buttonLoading" size="mini" type="primary" @click="submitForm">审批</el-button>
      <el-button v-if="isApproval" @click="cancel">取 消</el-button>
    </div>
    <verify ref="verifyRef" :task-id="taskId" :business-key="businessKey" :task-variables="taskVariables" @callSubmit="callSubmit" />
  </div>
</template>

<script>
import api from '@/api/workflow/workflowTest'
import processAip from '@/api/workflow/processInst'
import verify from '@/components/Process/Verify'
import { boolean } from 'yargs'
export default {
  name: 'WorkflowTestForm',
  components: {
    verify
  },
  props: {
    businessKey: String, // 业务唯一标识
    taskId: String, // 业务唯一标识
    isApproval: boolean // 是否显示审批按钮
  },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 业务表格数据
      tableList: [],
      // 表单参数
      form: {},
      // 流程实例名称
      processInstName: null,
      // 表单校验
      rules: {
        id: [
          { required: true, message: '主键ID不能为空', trigger: 'blur' }
        ]
      },
      taskVariables: null
    }
  },
  watch: {
    businessKey: {
      immediate: true, // 很重要
      handler(newVal) {
        if (newVal) {
          this.getById()
        }
      }
    }
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$emit('closeForm')
    },
    callSubmit() {
      this.$emit('closeForm')
    },
    async getById() {
      const { data } = await api.getOne({ id: this.businessKey })
      this.form = data
      processAip.getProcessInstByBusinessKey(this.businessKey).then(response => {
        this.processInstName = response.data.name
      })
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.businessKey)
      api.getOne({ id: this.businessKey }).then(response => {
        this.taskVariables = {
          entity: response.data
        }
      })
      this.$refs.verifyRef.visible = true
    },
    // 提交流程
    submitFormAppply() {
      api.getOne({ id: this.form.id }).then(response => {
        const data = {
          processKey: null, // key
          businessKey: response.data.id, // 业务id
          variables: { entity: response.data } // 变量
        }
        processAip.startProcessApply(data).then(response => {
          if (response.code === 200) {
            this.$modal.msgSuccess(response.msg)
          }
        })
      })
    }
  }
}
</script>
