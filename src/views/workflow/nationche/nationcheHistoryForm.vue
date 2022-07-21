<template>
  <div>
    <div>
    <h2>提交人：{{form.crtUser}}</h2>
    <el-form  label-width="80px">
      <el-form-item label="社区名称">
          <el-input v-model="form.chename"/>
        </el-form-item>
        <el-form-item label="所属市">
          <el-input v-model="form.city"/>
        </el-form-item>
        <el-form-item label="县（市、区）">
          <el-input v-model="form.county"/>
        </el-form-item>
        <el-form-item label="所在乡（镇、办）">
          <el-input v-model="form.township"/>
        </el-form-item>
        <el-form-item label="总人口（人）">
          <el-input v-model="form.gp"/>
        </el-form-item>
        <el-form-item label="少数民族人口（人）">
          <el-input v-model="form.emp"/>
        </el-form-item>
        <el-form-item label="年人均收入（元）">
          <el-input v-model="form.gni"/>
        </el-form-item>
        <el-form-item label="年份">
          <el-input v-model="form.year"/>
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input v-model="form.opinion" type="textarea"/>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.explain" type="textarea"/>
        </el-form-item>
    </el-form>
    </div>
    <div v-for="(historyData, index) in fromData" :key="index" >
      <h2>{{historyData.taskNodeName}}</h2>
      <h3>审批人:{{historyData.createName}}</h3>
      <h3>审批时间:{{historyData.createdDate}}</h3>
      <el-form v-for="(fistoryFormData, indexH) in historyData.formHistoryDataDTO" :key="indexH" label-width="80px">
        <el-form-item :label=fistoryFormData.title >
          <el-input v-model="fistoryFormData.value"/>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { getNationChe } from '@/api/workflow/nationche'
  import { historyFromData } from '@/api/activiti/historyFormdata'
  export default {
    name: "leaveHistoryForm",
    props: {
      businessKey: {
        type: String
      }
    },
    data(){
      return{
        // 表单参数
        form: {},
        fromData:[],
      }
    },
    created() {
      this.getNationChe()
      this.historyFromData()
    },
    methods:{
      getNationChe() {
        getNationChe(this.businessKey).then(response => {
          this.form = response.data
        })
      },
      historyFromData() {
        historyFromData(this.businessKey).then(response => {
          this.fromData = response.data
        })
      },
    }

  }
</script>

<style scoped>

</style>
