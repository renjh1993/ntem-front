<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <!-- <el-form-item label="请假类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择请假类型" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="社区名称" prop="title">
        <el-input
          v-model="queryParams.chename"
          placeholder="请输入社区名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['workflow:nationche:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['workflow:leave:export']"
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="nationcheList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--      <el-table-column label="主键ID" align="center" prop="id" />-->
      <el-table-column label="社区名称" align="center" prop="chename" />
      <el-table-column label="所属市" align="center" prop="city" />
      <el-table-column label="县（市、区）" align="center" prop="county" />
      <el-table-column label="所在乡（镇、办）" align="center" prop="township" />
      <el-table-column label="总人口（人）" align="center" prop="gp" />
      <el-table-column label="少数民族人口（人）" align="center" prop="emp" />
      <el-table-column label="年人均收入（元）" align="center" prop="gni" />
      <el-table-column label="年份" align="center" prop="year" />
      <el-table-column label="审批意见" align="center" prop="opinion" />
      <el-table-column label="说明" align="center" prop="explain" />

      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.status!=0">
            {{ statusFormat(scope.row) }}
          </div>
          <div v-else>
            {{ scope.row.taskName }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="'1'==scope.row.status || '3'==scope.row.status "
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-if="'1'==scope.row.status"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleSub(scope.row)"
          >提交
          </el-button>
          <el-button
            v-if="'1'==scope.row.status || '5'==scope.row.status
              ||'4'==scope.row.status || '7'==scope.row.status"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
          <el-button
            v-if="'7' == scope.row.status "
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="reSubmit(scope.row)"
          >重新提交
          </el-button>

          <el-button
            v-if="'1' != scope.row.status "
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="historyFory(scope.row)"
          >审批详情
          </el-button>
          <el-button
            v-if="'4'==scope.row.status"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >提交修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 查看详细信息话框 -->
    <el-dialog :title="title" :visible.sync="open2" width="500px" append-to-body>
      <approvalDetail v-if="open2" :process-instance-id="instanceId" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="open2=!open2">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 新增弹出框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" :is-drfat="isDraft" label-width="140px">
        <el-form-item label="社区名称" prop="chename">
          <el-input v-model="form.chename" />
        </el-form-item>
        <el-form-item label="所属市" prop="city">
          <el-input v-model="form.city" />
        </el-form-item>
        <el-form-item label="县（市、区）" prop="county">
          <el-input v-model="form.county" />
        </el-form-item>
        <el-form-item label="所在乡（镇、办）" prop="township">
          <el-input v-model="form.township" />
        </el-form-item>
        <el-form-item label="总人口（人）" prop="gp">
          <el-input v-model="form.gp" />
        </el-form-item>
        <el-form-item label="少数民族人口（人）" prop="emp">
          <el-input v-model="form.emp" />
        </el-form-item>
        <el-form-item label="年人均收入（元）" prop="gni">
          <el-input v-model="form.gni" />
        </el-form-item>
        <el-form-item label="年份" prop="year">
          <div class="block">
            <el-date-picker
              v-model="form.year"
              type="year"
              value-format="yyyy"
              placeholder="选择年"
            />
          </div>
        </el-form-item>
        <el-form-item label="审批意见" prop="opinion">
          <el-input v-model="form.opinion" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="说明" prop="explain">
          <el-input v-model="form.explain" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="true == isDraft " @click="asDraft">暂 存</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 更新弹出框 -->
    <el-dialog :title="title" :visible.sync="openUpdate" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" :is-drfat="isDraft" label-width="140px">
        <el-form-item label="社区名称" prop="chename">
          <el-input v-model="form.chename" />
        </el-form-item>
        <el-form-item label="所属市" prop="city">
          <el-input v-model="form.city" />
        </el-form-item>
        <el-form-item label="县（市、区）" prop="county">
          <el-input v-model="form.county" />
        </el-form-item>
        <el-form-item label="所在乡（镇、办）" prop="township">
          <el-input v-model="form.township" />
        </el-form-item>
        <el-form-item label="总人口（人）" prop="gp">
          <el-input v-model="form.gp" />
        </el-form-item>
        <el-form-item label="少数民族人口（人）" prop="emp">
          <el-input v-model="form.emp" />
        </el-form-item>
        <el-form-item label="年人均收入（元）" prop="gni">
          <el-input v-model="form.gni" />
        </el-form-item>
        <el-form-item label="年份" prop="year">
          <div class="block">
            <el-date-picker
              v-model="form.year"
              type="year"
              value-format="yyyy"
              placeholder="选择年"
            />
          </div>
        </el-form-item>
        <el-form-item label="审批意见" prop="opinion">
          <el-input v-model="form.opinion" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="说明" prop="explain">
          <el-input v-model="form.explain" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormUpdate">确 定</el-button>
        <el-button @click="cancelUpdate">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 提交修改弹出框 -->
    <el-dialog :title="title" :visible.sync="openEdit" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" :is-drfat="isDraft" label-width="140px">
        <el-form-item label="社区名称" prop="chename">
          <el-input v-model="form.chename" />
        </el-form-item>
        <el-form-item label="所属市" prop="city">
          <el-input v-model="form.city" />
        </el-form-item>
        <el-form-item label="县（市、区）" prop="county">
          <el-input v-model="form.county" />
        </el-form-item>
        <el-form-item label="所在乡（镇、办）" prop="township">
          <el-input v-model="form.township" />
        </el-form-item>
        <el-form-item label="总人口（人）" prop="gp">
          <el-input v-model="form.gp" />
        </el-form-item>
        <el-form-item label="少数民族人口（人）" prop="emp">
          <el-input v-model="form.emp" />
        </el-form-item>
        <el-form-item label="年人均收入（元）" prop="gni">
          <el-input v-model="form.gni" />
        </el-form-item>
        <el-form-item label="年份" prop="year">
          <div class="block">
            <el-date-picker
              v-model="form.year"
              type="year"
              value-format="yyyy"
              placeholder="选择年"
            />
          </div>
        </el-form-item>
        <el-form-item label="审批意见" prop="opinion">
          <el-input v-model="form.opinion" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="说明" prop="explain">
          <el-input v-model="form.explain" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormEdit">确 定</el-button>
        <el-button @click="cancelEdit">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 重新提交弹出框 -->
    <el-dialog :title="title" :visible.sync="openRe" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" :is-drfat="isDraft" label-width="140px">
        <el-form-item label="社区名称" prop="chename">
          <el-input v-model="form.chename" />
        </el-form-item>
        <el-form-item label="所属市" prop="city">
          <el-input v-model="form.city" />
        </el-form-item>
        <el-form-item label="县（市、区）" prop="county">
          <el-input v-model="form.county" />
        </el-form-item>
        <el-form-item label="所在乡（镇、办）" prop="township">
          <el-input v-model="form.township" />
        </el-form-item>
        <el-form-item label="总人口（人）" prop="gp">
          <el-input v-model="form.gp" />
        </el-form-item>
        <el-form-item label="少数民族人口（人）" prop="emp">
          <el-input v-model="form.emp" />
        </el-form-item>
        <el-form-item label="年人均收入（元）" prop="gni">
          <el-input v-model="form.gni" />
        </el-form-item>
        <el-form-item label="年份" prop="year">
          <div class="block">
            <el-date-picker
              v-model="form.year"
              type="year"
              value-format="yyyy"
              placeholder="选择年"
            />
          </div>
        </el-form-item>
        <el-form-item label="审批意见" prop="opinion">
          <el-input v-model="form.opinion" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="说明" prop="explain">
          <el-input v-model="form.explain" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormRe">确 定</el-button>
        <el-button @click="cancelRe">取 消</el-button>
      </div>
    </el-dialog>

    <approvalForm ref="approvalForm" :business-key="businessKey" :process-instance-id="instanceId" />
  </div>
</template>

<script>
import { listNationChe, getNationChe, addNationChe, draft, updateNationChe, delNationChe, editNationChe, exportNationChe } from '@/api/workflow/nationche'
import { getDefinitionsByInstanceId } from '@/api/activiti/definition'
import approvalForm from '@/views/components/approvalForm'

export default {
  name: 'NationCHE',
  components: {
    approvalForm
  },
  data() {
    return {
      modelVisible: false,

      modelerUrl: '',
      userName: '',
      createName: '',
      businessKey: '',
      instanceId: null,
      visible: false,
      // 是否显示暂存按钮
      isDraft: false,
      // 用户信息
      user: {},
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 请假表格数据
      nationcheList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      open2: false,
      openUpdate: false,
      openRe: false,
      openEdit: false,
      // 请假类型字典
      // typeOptions: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        chename: null,
        city: null,
        county: null,
        township: null,
        gp: null,
        emp: null,
        gni: null,
        year: null,
        opinion: null,
        explain: null,
        crtUser: null,
        crtDate: null,
        updUser: null,
        updDate: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [
          { required: true, message: '请假类型不能为空', trigger: 'change' }
        ],
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '原因不能为空', trigger: 'blur' }
        ],
        leaveStartTime: [
          { required: true, message: '开始时间不能为空', trigger: 'blur' }
        ],
        leaveEndTime: [
          { required: true, message: '结束时间不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    // this.getDicts('activiti_leave_type').then(response => {
    //   this.typeOptions = response.data
    // })
    this.getDicts('activiti_flow_type').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    /** 查询请假列表 */
    getList() {
      this.loading = true
      listNationChe(this.queryParams).then(response => {
        this.nationcheList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 请假类型字典翻译
    // typeFormat(row, column) {
    //   return this.selectDictLabel(this.typeOptions, row.type)
    // },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    cancelUpdate() {
      this.openUpdate = false
      // this.reset()
    },
    cancelRe() {
      this.openRe = false
      // this.reset()
    },
    cancelEdit() {
      this.openEdit = false
      // this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        chename: null,
        city: null,
        county: null,
        township: null,
        gp: null,
        emp: null,
        gni: null,
        year: null,
        opinion: null,
        explain: null,
        crtUser: null,
        crtDate: null,
        updUser: null,
        updDate: null,
        status: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.createName = this.$store.getters.nickName
      if (this.$store.getters.name !== 'admin') {
        this.reset()
        this.isDraft = true
        this.open = true
        this.title = '添加请假'
      } else {
        this.$alert('管理员不能创建流程', '管理员不能创建流程', {
          confirmButtonText: '确定'
        })
      }
    },
    /** 更新按钮操作 */
    handleUpdate(row) {
      this.reset()
      getNationChe(row.id).then(response => {
        this.form = response.data
        // this.form.id = null
        this.openUpdate = true
        this.title = '更新'
      })
    },
    /** 提交修改按钮操作 */
    handleEdit(row) {
      this.reset()
      getNationChe(row.id).then(response => {
        this.form = response.data
        // this.form.id = null
        this.openEdit = true
        this.title = '提交修改'
      })
    },
    /** 重新提交 */
    reSubmit(row) {
      this.reset()
      getNationChe(row.id).then(response => {
        this.form = response.data
        // this.form.id = null
        this.openRe = true
        this.title = '重新提交'
      })
    },

    /** 审批详情 */
    historyFory(row) {
      this.instanceId = row.instanceId
      this.businessKey = row.id
      console.log('this.instanceId ===> ' + this.instanceId)
      console.log('this.businessKey ===> ' + this.businessKey)
      this.$refs.approvalForm.visible = true
    },
    /** 进度查看 */
    checkTheSchedule(row) {
      getDefinitionsByInstanceId(row.instanceId).then(response => {
        const data = response.data
        // this.url = '/bpmnjs/index.html?type=lookBpmn&deploymentFileUUID='+data.deploymentID+'&deploymentName='+ encodeURI(data.resourceName);
        this.modelerUrl = '/bpmnjs/index.html?type=lookBpmn&instanceId=' + row.instanceId + '&deploymentFileUUID=' + data.deploymentID + '&deploymentName=' + encodeURI(data.resourceName)
        this.modelVisible = true
      })
    },

    handleSub(row) {
      // row.processKey = "testleave"
      row.businessRoute = this.$route.name
      addNationChe(row).then(response => {
        this.msgSuccess('提交成功')
        this.getList()
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateNationChe(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            // this.form.processKey = "testleave"
            this.form.businessRoute = this.$route.name
            addNationChe(this.form).then(response => {
              this.msgSuccess('提交成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    submitFormUpdate() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.businessRoute = this.$route.name
          updateNationChe(this.form).then(response => {
            this.msgSuccess('更新成功')
            this.openUpdate = false
            this.getList()
          })
        }
      })
    },
    submitFormRe() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.businessRoute = this.$route.name
          addNationChe(this.form).then(response => {
            this.msgSuccess('重新提交成功')
            this.openRe = false
            this.getList()
          })
        }
      })
    },
    submitFormEdit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.businessRoute = this.$route.name
          this.form.instanceId = this.instanceId
          editNationChe(this.form).then(response => {
            this.msgSuccess('提交修改成功')
            this.openEdit = false
            this.getList()
          })
        }
      })
    },
    /** 暂存按钮 */
    asDraft() {
      this.$refs['form'].validate(valid => {
        draft(this.form).then(response => {
          this.msgSuccess('暂存成功')
          this.open = false
          this.getList()
        })
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id // || this.ids
      this.$confirm('是否确认删除请假编号为"' + id + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        var param = {
          'id': id
        }
        return delNationChe(param)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有请假数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportNationChe(queryParams)
      }).then(response => {
        this.download(response.message)
      })
    },
    chooseMedicine() {
      this.form.title = this.createName + '的' + this.form.type + '申请'
    }
  }

}
</script>
