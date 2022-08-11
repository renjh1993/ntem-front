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
        <el-button type="primary" @click="submitForm(formData)" size="small">提交</el-button>
        <!-- <el-button type="success" @click="transmitClick()" size="small">转发</el-button> -->
        <el-button size="small" @click="visible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
 <Navbar ref="navbar" v-show="false"/>
  
</div>
</template>
<script>
import api from "@/api/workflow/task";
import ChooseWorkflowUser from "@/views/components/user/choose-workflow-user ";
import  SysUser from "@/views/components/user/sys-user";
import  Navbar  from "../../layout/components/Navbar.vue";
export default {
  props: {
    businessKey: String,
    taskId: String,
    taskVariables: Object,
  },
  components: {
    ChooseWorkflowUser,
    SysUser,
    Navbar
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
    openLoading(){
    const loading = this.$loading({         // 声明一个loading对象       
      lock: true,   
      text: '提交中',                        // 是否锁屏
      fullScreen: true,                     //是否为全屏 Dialog
      background: "rgba(255,255,255,0.7)"   //遮罩背景色
    })
   
    return loading;
  },
    // 提交表单数据
    async submitForm(formName) {
      const loadingInstance =  this.openLoading();
 let params = {
        message: formName.message,
        delegate: this.delegate,
        taskId: this.taskId,
        businessKey: this.businessKey
 }
 api.completeTask(params).then(response => {  
  loadingInstance.close();       
           // 刷新数据
              this.$message.success("办理成功");
              // 将表单清空
              // this.$refs[formName].resetFields();
              this.$refs.navbar.reload();
              // 关闭窗口
              this.visible = false;
              
              // 回调事件
              this.$emit("callSubmit")
        },()=>{
          loadingInstance.close();
        })
    },
   
}};
</script>
