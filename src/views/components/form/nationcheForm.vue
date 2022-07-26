<template>
  <div>
    <div >
    <!-- <h2>提交人：{{form.crtUser}}</h2> -->
    <h2>{{this.processInstName}}</h2>
    
    <el-form  label-width="80px">
      <el-form-item label="社区名称">
          <el-input v-model="form.chename" readonly/>
        </el-form-item>
        <el-form-item label="所属市">
          <el-input v-model="form.city" readonly/>
        </el-form-item>
        <el-form-item label="县（市、区）">
          <el-input v-model="form.county" readonly/>
        </el-form-item>
        <el-form-item label="所在乡（镇、办）">
          <el-input v-model="form.township" readonly/>
        </el-form-item>
        <el-form-item label="总人口（人）">
          <el-input v-model="form.gp" readonly/>
        </el-form-item>
        <el-form-item label="少数民族人口（人）">
          <el-input v-model="form.emp" readonly/>
        </el-form-item>
        <el-form-item label="年人均收入（元）">
          <el-input v-model="form.gni" readonly/>
        </el-form-item>
        <el-form-item label="年份">
          <el-input v-model="form.year" readonly/>
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input v-model="form.opinion" type="textarea" readonly/>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.explain" type="textarea" readonly/>
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
import { getNationChe, addNationChe, updateNationChe } from "@/api/workflow/nationche";
import processAip from "@/api/workflow/processInst";
import verify from "@/components/Process/Verify";
import { boolean } from "yargs";
export default {
  name: "Leave",
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
      //流程实例名称
      processInstName: undefined,
      // 表单校验
      rules: {
        id: [
          { required: true, message: "主键ID不能为空", trigger: "blur" }
        ],
        username: [
          { required: true, message: "申请人用户名不能为空", trigger: "blur" }
        ],
        duration: [
          { required: true, message: "请假时长，单位：天不能为空", trigger: "blur" }
        ],
        principal: [
          { required: true, message: "工作委托人不能为空", trigger: "blur" }
        ],
        contactPhone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        leaveType: [
          { required: true, message: "请假类型不能为空", trigger: "change" }
        ],
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        leaveReason: [
          { required: true, message: "请假原因不能为空", trigger: "blur" }
        ],
        startDate: [
          { required: true, message: "请假开始时间不能为空", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "请假结束时间不能为空", trigger: "blur" }
        ]
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
        const {data} = await getNationChe(this.businessKey)
        this.form = data;
        processAip.getProcessInstByBusinessKey(this.businessKey).then(response => {
          this.processInstName = response.data.name;
        })
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.businessKey)
      getNationChe(this.businessKey).then(response => {
            this.taskVariables = {
                 entity: response.data,
                 userId :1
            };
      });
      this.$refs.verifyRef.visible = true
    },
    //提交流程
    submitFormAppply(){
        getNationChe(this.form.id).then(response => {
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
