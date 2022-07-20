<template>
  <div>
    <div >
    <h2>请假人：{{form.createBy}}</h2>
    
    <el-form  label-width="80px">
      <el-form-item label="村名称" >
       <el-input v-model="form.cunName" readonly />
      </el-form-item>
      <el-form-item label="所属市">
        <el-input v-model="form.city" readonly/>
      </el-form-item>
      <el-form-item label="县（市，区）" >
        <el-input type="textarea" v-model="form.county" readonly></el-input>
        
      </el-form-item>
      <el-form-item label="所在乡（镇、办）">
        <el-input v-model="form.township" readonly/>
      </el-form-item>
     
    </el-form>
    </div>
    
      <div slot="footer" class="dialog-footer">
       
        <el-button v-if="isApproval" :loading="buttonLoading" size="mini" type="primary" @click="submitForm">审批</el-button>
        <el-button v-if="isApproval" @click="cancel">取 消</el-button>
      </div>
      <verify ref="verifyRef" :taskId="taskId" :businessKey='businessKey' @callSubmit="callSubmit" :taskVariables="taskVariables"></verify>
  </div>
</template>

<script>
import { getMzctj, addMzctj, updateMzctj } from "@/api/workflow/mzctj";
import processAip from "@/api/workflow/processInst";
 import verify from "@/components/Process/Verify";
import { boolean } from "yargs";
export default {
  name: "Mzctj",
  dicts: ['bs_leave_type'],
  props: {
      businessKey: String, // 业务唯一标识
      taskId: String, // 业务唯一标识
     isApproval: boolean //是否显示审批按钮
  },
  components: {
      verify
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
        
      },
      taskVariables: undefined
    };
  },
  watch: {
      businessKey: {
          immediate: true, // 很重要！！！
          handler (newVal) {
              if(newVal) {
                  this.getById()
              }
          }
      }
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$emit("closeForm")
    },
    callSubmit(){
      this.$emit("closeForm")
    },
    async getById() {
        const {data} = await getMzctj(this.businessKey)
        this.form = data;
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.businessKey)
      getMzctj(this.businessKey).then(response => {
            this.taskVariables = {
                 entity: response.data,
                 userId :1
            };
      });
      this.$refs.verifyRef.visible = true
    },
    //提交流程
    submitFormAppply(){
        getMzctj(this.form.id).then(response => {
            const data = {
            processKey: 'testkey', // key
            
            businessKey: response.data.id, // 业务id
            variables: { entity: response.data }, // 变量
            }
            processAip.startProcessApply(data).then(response => {
              if(response.code===200){
                this.$modal.msgSuccess(response.msg);
              }
            })
        });
    }
  }
};
</script>
