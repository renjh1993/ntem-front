<template>
  <div>
    <div>
      <h2>{{ processInstName }}</h2>
      <el-form label-width="80px">
        <el-form-item label="id">
          <el-input v-model="form.userid" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="form.idcard" />
        </el-form-item>
        <el-form-item label="性别 （0：女  1：男）">
          <el-input v-model="form.gender" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.tel" />
        </el-form-item>
        <el-form-item label="最高学历毕业院校">
          <el-input v-model="form.zgbyyx" />
        </el-form-item>
        <el-form-item label="最高学历专业">
          <el-input v-model="form.zgxlzy" />
        </el-form-item>
        <el-form-item label="最高学历">
          <el-input v-model="form.zgxl" />
        </el-form-item>
        <el-form-item label="证书编号">
          <el-input v-model="form.zsbh" />
        </el-form-item>
        <el-form-item label="技能">
          <el-input v-model="form.skills" />
        </el-form-item>
        <el-form-item label="入职日期">
          <el-input v-model="form.entrydate" />
        </el-form-item>
        <el-form-item label="最高学历毕业日期">
          <el-input v-model="form.zgxlbyrq" />
        </el-form-item>
        <el-form-item label="离职日期">
          <el-input v-model="form.godate" />
        </el-form-item>
        <el-form-item label="base地">
          <el-input v-model="form.basearea" />
        </el-form-item>
        <el-form-item label="状态（0：离职 1：在职）">
          <el-input v-model="form.status" />
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model="form.crtuser" />
        </el-form-item>
        <el-form-item label="创建日期">
          <el-input v-model="form.crtdate" />
        </el-form-item>
        <el-form-item label="修改者">
          <el-input v-model="form.upduser" />
        </el-form-item>
        <el-form-item label="修改日期">
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
import api from '@/api/em/tEmUser'
import { historyFromData } from '@/api/activiti/historyFormdata'
export default {
  name: 'TEmUserHistoryForm',
  props: {
    businessKey: {
      type: String,
      default: null
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
