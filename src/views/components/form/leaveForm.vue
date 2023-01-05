<template>
  <div>
    <div>
      <h2>请假人：{{ form.createBy }}</h2>

      <el-form label-width="80px">
        <el-form-item label="请假类型">
          <el-input v-model="form.type" readonly />
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title" readonly />
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model="form.reason" type="textarea" readonly />

        </el-form-item>
        <el-form-item label="开始时间">
          <el-input v-model="form.leaveStartTime" readonly />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="form.leaveEndTime" readonly />
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">

      <el-button v-if="isApproval" :loading="buttonLoading" type="primary" @click="submitForm">审批</el-button>
      <el-button v-if="isApproval" @click="cancel">取 消</el-button>
    </div>
    <verify ref="verifyRef" :task-id="taskId" :business-key="businessKey" :task-variables="taskVariables" @callSubmit="callSubmit" />
  </div>
</template>

<script>
import { getLeave } from '@/api/workflow/leave'
import processAip from '@/api/workflow/processInst'
import verify from '@/components/Process/Verify'
import { boolean } from 'yargs'
export default {
  name: 'Leave',
  dicts: ['bs_leave_type'],
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
      // 请假业务表格数据
      leaveList: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: '主键ID不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '申请人用户名不能为空', trigger: 'blur' }
        ],
        duration: [
          { required: true, message: '请假时长，单位：天不能为空', trigger: 'blur' }
        ],
        principal: [
          { required: true, message: '工作委托人不能为空', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' }
        ],
        leaveType: [
          { required: true, message: '请假类型不能为空', trigger: 'change' }
        ],
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        leaveReason: [
          { required: true, message: '请假原因不能为空', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请假开始时间不能为空', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请假结束时间不能为空', trigger: 'blur' }
        ]
      },
      taskVariables: undefined
    }
  },
  watch: {
    businessKey: {
      immediate: true, // 很重要！！！
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
      const { data } = await getLeave(this.businessKey)
      this.form = data
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.businessKey)
      getLeave(this.businessKey).then(response => {
        this.taskVariables = {
          entity: response.data,
          userId: 1
        }
      })
      this.$refs.verifyRef.visible = true
    },
    // 提交流程
    submitFormAppply() {
      getLeave(this.form.id).then(response => {
        const data = {
          processKey: 'testkey', // key

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
