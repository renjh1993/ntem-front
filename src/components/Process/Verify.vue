<template>
<div v-if="visible">
  <!-- 提交申请开始 -->
  <el-dialog  title="审批意见" :visible.sync="visible"  width="800px"  :close-on-click-modal="false"
  append-to-body destroy-on-close @close="closeDialog" >
    <el-form v-loading="loading"  :rules="rules" ref="formData" :model="formData" status-icon >
      <el-form-item label="审批意见" prop="message" label-width="120px">
        <el-input  type="textarea" v-model="formData.message" maxlength="300"  placeholder="请输入审批意见" :autosize="{ minRows: 4 }" show-word-limit ></el-input>
      </el-form-item>
    
       <el-form-item label="是否同意"  prop="delegate" label-width="120px" >
         <el-col :span="12">
           <div class="grid-content bg-purple">
             <el-radio-group v-model="delegate" @change="changeDelegate" size="small">
              <el-radio label="1" border>是</el-radio>
              <el-radio label="2" border>否</el-radio>
            </el-radio-group>
           </div>
        </el-col>
        
      </el-form-item>
      <el-form-item align="center">
        <el-button type="primary" @click="submitForm('formData')" size="small">提交</el-button>
        <!-- <el-button type="success" @click="transmitClick()" size="small">转发</el-button> -->
        <el-button size="small" @click="visible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
 
  
</div>
</template>
<script>
import api from "@/api/workflow/task";
import ChooseWorkflowUser from "@/views/components/user/choose-workflow-user ";
import  SysUser from "@/views/components/user/sys-user";
export default {
  props: {
    businessKey: String,
    taskId: String,
    taskVariables: Object,
  },
  components: {
    ChooseWorkflowUser,
    SysUser
  },
  data() {
    return {
      visible: false, // 弹出窗口，true弹出
      loading: false,
      transmitVisible: false,
      formData: {
        // 提交表单数据
        message: null,
        
      },
      
      delegate: '1',//是否委托
     
    };
  },

 
  methods: {
    // 提交表单数据
    async submitForm(formName) {
 let params = {
        message: formName.message,
        delegate: this.delegate,
        taskId: this.taskId,
        businessKey: this.businessKey
 }
let response = await api.completeTask(params);
            if (response.code === 200) {
              // 刷新数据
              this.$message.success("办理成功");
              // 将表单清空
              // this.$refs[formName].resetFields();
              // 关闭窗口
              this.visible = false;
              // 回调事件
              this.$emit("callSubmit")
            }
  
    },
   
}};
</script>
