<template>
  <div>
    <div>
      <h2>{{ processInstName }}</h2>
      <el-form label-width="80px">
        <el-form-item label="ID">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="配资申请表">
          <el-input v-model="form.pzsqb" />
        </el-form-item>
        <el-form-item label="转贷申请表">
          <el-input v-model="form.zdsqb" />
        </el-form-item>
        <el-form-item label="基础资料扫描原件">
          <el-input v-model="form.jczlsmyj" />
        </el-form-item>
        <el-form-item label="借款人背景资料">
          <el-input v-model="form.jkrbjzl" />
        </el-form-item>
        <el-form-item label="其他资料">
          <el-input v-model="form.qtzl" />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="form.crtuser" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="form.crtdate" />
        </el-form-item>
        <el-form-item label="更新人">
          <el-input v-model="form.upduser" />
        </el-form-item>
        <el-form-item label="更新时间">
          <el-input v-model="form.upddate" />
        </el-form-item>
      </el-form>
    </div>
    <div v-for="(historyData, index) in fromData" :key="index">
      <h2>{{ historyData.taskNodeName }}</h2>
      <h3>审批人:{{ historyData.createName }}</h3>
      <h3>审批时间:{{ historyData.createdDate }}</h3>
      <el-form v-for="(fistoryFormData, indexH) in historyData.formHistoryDataDTO" :key="indexH" label-width="80px">
        <el-form-item :label="fistoryFormData.title">
          <el-input v-model="fistoryFormData.value" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '@/api/workflow/workflowZdlc'
import { historyFromData } from '@/api/activiti/historyFormdata'
export default {
  name: 'WorkflowZdlcHistoryForm',
  props: {
    businessKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 表单参数
      form: {},
      fromData: []
    }
  },
  created() {
    this.getOne()
    this.historyFromData()
  },
  methods: {
    getOne() {
      api.getOne({ id: this.businessKey }).then(response => {
        this.form = response.data
      })
    },
    historyFromData() {
      historyFromData(this.businessKey).then(response => {
        this.fromData = response.data
      })
    }
  }

}
</script>

<style scoped>

</style>
