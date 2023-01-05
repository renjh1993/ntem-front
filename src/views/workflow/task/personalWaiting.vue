<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
      <el-form-item label="流程名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入流程名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button
      type="primary"
      size="small"
      icon="el-icon-s-check"
      :disabled="ids.length === 0"
      @click="batchHandle"
    >批量办理</el-button>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="流程名称" align="center" prop="processDefinitionName" />
      <el-table-column label="任务节点名称" align="center" prop="name" />
      <el-table-column label="任务状态" align="center" prop="processStatus" />
      <el-table-column label="办理人" align="center" prop="assignee" />
      <el-table-column align="center" prop="businessKey" :show-overflow-tooltip="true" label="流程关联业务ID" width="160" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <!-- <el-button size="mini" icon="el-icon-sort" v-if="!scope.row.assignee" type="text" @click="clickClaim(scope.row)">签收 &nbsp;</el-button> -->
              <el-button

                type="text"
                size="mini"
                icon="el-icon-sort"
                @click="clickTaskPop(scope.row)"
              >办理</el-button>

              <el-button

                type="text"
                size="mini"
                icon="el-icon-sort"
                @click="clickStopPop(scope.row)"
              >终止</el-button>
              <el-button
                type="text"
                size="mini"
                icon="el-icon-tickets"
                @click="clickHistPop(scope.row)"
              >审批记录</el-button>
            </el-col>
          </el-row>
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

    <!-- 通过 -->
    <verify ref="verifyRef" :task-id="taskId" :task-variables="taskVariables" />
    <!-- 批量通过 -->
    <batchverify ref="batchVerifyRef" :batch-data="permissionz.list" @batchCallSubmit="batchCallSubmit" />
    <!-- 驳回 -->
    <back ref="backRef" :task="task" />
    <el-dialog v-if="visible" title="审批记录" :visible.sync="visible" width="60%" :close-on-click-modal="false">
      <history :process-instance-id="processInstanceId" />
    </el-dialog>
    <approvalForm
      ref="approvalForm"
      :business-key="businessKey"
      :is-approval="isApproval"
      :task-id="taskId"
      :process-instance-id="processInstanceId"
      @refresh="refresh"
    />
  </div>
</template>

<script>
import api from '@/api/workflow/task'
import verify from '@/components/Process/Verify'
import history from '@/components/Process/History'
import Back from '@/components/Process/Back'
import approvalForm from '@/views/components/approvalForm'
import batchverify from '@/components/Process/BatchVerify'

export default {
  components: {
    verify,
    Back,
    history,
    approvalForm,
    batchverify
  },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      businessKeys: [],
      permissionz: {
        selections: [],
        list: {}
      },
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 是否显示弹出层
      open: false,
      // 表格数据
      dataList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined
      },
      // 任务id
      taskId: undefined,
      // 点击的行数据
      task: {},
      taskVariables: undefined,
      processInstanceId: undefined,
      businessKey: undefined, // 业务唯一标识
      visible: false,
      isApproval: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateTime = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.businessKeys = selection.map(item => item.businessKey)
      this.single = selection.length !== 1
      this.multiple = !selection.length

      this.permissionz.list = selection.map(item => ({
        'taskId': item.id,
        'businessKey': item.businessKey
      }))
    },
    batchCallSubmit() {
      // this.$emit("closeForm")
      this.refresh()
    },
    // 分页
    getList() {
      this.loading = true
      api.getTaskWaitByPage(this.queryParams).then(response => {
        this.dataList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 刷新
    refresh() {
      this.getList()
    },

    /**
       * 批量审批
       */
    batchHandle() {
      this.$refs.batchVerifyRef.visible = true
    },

    clickTaskPop(row) {
      console.log('row===' + row.id)
      this.businessKey = row.businessKey
      this.processInstanceId = row.processInstanceId
      this.taskId = row.id
      this.$refs.approvalForm.visible = true
    },
    clickHistPop(row) {
      this.processInstanceId = row.processInstanceId
      this.visible = true
    },
    // 驳回任务弹出层
    clickBackPop(row) {
      this.task = row
      console.log(this.task)
      this.$refs.backRef.visible = true
    },
    clickStopPop(row) {
      const parm = {
        taskId: row.id,
        businessKey: row.businessKey
      }

      this.$confirm('确定终止该流程吗').then(() => {
        this.loading = true
        return api.stopProcess(parm)
      }).then(() => {
        this.loading = false
        this.getList()
        this.msgSuccess('终止成功')
      }).finally(() => {
        this.loading = false
      })
    }

  }
}
</script>
