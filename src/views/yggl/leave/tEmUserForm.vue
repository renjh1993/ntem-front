<template>
  <div>
    <div>
      <h2>{{ processInstName }}</h2>
      <el-form label-width="80px">
        <el-form-item label="id">
          <el-input v-model="form.userid" readonly />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" readonly />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="form.idcard" readonly />
        </el-form-item>
        <el-form-item label="性别 （0：女  1：男）">
          <el-input v-model="form.gender" readonly />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.tel" readonly />
        </el-form-item>
        <el-form-item label="最高学历毕业院校">
          <el-input v-model="form.zgbyyx" readonly />
        </el-form-item>
        <el-form-item label="最高学历专业">
          <el-input v-model="form.zgxlzy" readonly />
        </el-form-item>
        <el-form-item label="最高学历">
          <el-input v-model="form.zgxl" readonly />
        </el-form-item>
        <el-form-item label="证书编号">
          <el-input v-model="form.zsbh" readonly />
        </el-form-item>
        <el-form-item label="技能">
          <el-input v-model="form.skills" readonly />
        </el-form-item>
        <el-form-item label="入职日期">
          <el-input v-model="form.entrydate" readonly />
        </el-form-item>
        <el-form-item label="最高学历毕业日期">
          <el-input v-model="form.zgxlbyrq" readonly />
        </el-form-item>
        <el-form-item label="离职日期">
          <el-input v-model="form.godate" readonly />
        </el-form-item>
        <el-form-item label="base地">
          <el-input v-model="form.basearea" readonly />
        </el-form-item>
        <el-form-item label="状态（0：离职 1：在职）">
          <el-input v-model="form.status" readonly />
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model="form.crtuser" readonly />
        </el-form-item>
        <el-form-item label="创建日期">
          <el-input v-model="form.crtdate" readonly />
        </el-form-item>
        <el-form-item label="修改者">
          <el-input v-model="form.upduser" readonly />
        </el-form-item>
        <el-form-item label="修改日期">
          <el-input v-model="form.upddate" readonly />
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button v-if="isApproval" :loading="buttonLoading" size="mini" type="primary" @click="submitForm">审批
      </el-button>
      <el-button v-if="isApproval" @click="cancel">取 消</el-button>
    </div>
    <verify
      ref="verifyRef"
      :task-id="taskId"
      :business-key="businessKey"
      :task-variables="taskVariables"
      @callSubmit="callSubmit"
    />
  </div>
</template>

<script>
import api from '@/api/em/tEmUser'
import processAip from '@/api/workflow/processInst'
import verify from '@/components/Process/Verify'
import { boolean } from 'yargs'

export default {
  name: 'TEmUserForm',
  components: {
    verify
  },
  props: {
    // 业务唯一标识
    businessKey: {
      type: String,
      default: ''
    },
    // 业务唯一标识
    taskId: {
      type: String,
      default: ''
    },
    // 是否显示审批按钮
    isApproval: boolean
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
