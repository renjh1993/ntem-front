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
      <el-form-item label="任务发起人" prop="key">
        <el-input
          v-model="queryParams.startUserId"
          placeholder="请输入任务发起人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column fixed align="center" type="index" label="序号" width="50" />
      <el-table-column fixed align="center" prop="name" label="流程定义名称" />
      <el-table-column align="center" prop="processDefinitionKey" label="流程定义KEY" />
      <el-table-column align="center" prop="processDefinitionVersion" label="版本号" width="90">
        <template slot-scope="{row}"> v{{ row.processDefinitionVersion }}.0</template>
      </el-table-column>
      <el-table-column align="center" prop="startUserNickName" label="流程发起人" min-width="130" />
      <el-table-column align="center" prop="isSuspended" label="流程状态" width="160">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isSuspended=='激活'" type="success">激活</el-tag>
          <el-tag v-else type="danger">挂起</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="currTaskInfo" :show-overflow-tooltip="true" label="当前办理人" width="160" />
      <el-table-column align="center" prop="businessKey" :show-overflow-tooltip="true" label="流程关联业务ID" width="160" />
      <el-table-column align="center" prop="startTime" label="流程启动时间" width="160" />
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-if="scope.row.isSuspended == '激活'"
                type="text"
                size="mini"
                icon="el-icon-sort"
                @click="clickUpdateProcDefState(scope.row)"
              >挂起</el-button>
              <el-button
                v-else
                type="text"
                size="mini"
                icon="el-icon-sort"
                @click="clickUpdateProcDefState(scope.row)"
              >激活</el-button>
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
  </div>
</template>

<script>
import api from '@/api/workflow/processInst'

export default {
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
        name: undefined,
        key: undefined
      }
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 分页
    getList() {
      this.loading = true
      api.getProcessInstRunningByPage(this.queryParams).then(response => {
        this.dataList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    handleDelete(row) {
      let parm = {}
      parm = {
        processInstanceId: row.processInstanceId
      }
      this.$confirm('是否确认删除流程实例ID为"' + row.processInstanceId + '"的数据项？').then(() => {
        this.loading = true
        return api.deleteRuntimeProcessAndHisInst(parm)
      }).then(() => {
        this.loading = false
        this.getList()
        this.msgSuccess('删除成功')
      }).finally(() => {
        this.loading = false
      })
    },
    // 激活或挂起流程
    clickUpdateProcDefState(row) {
      let msg = ''
      let parm = {}
      if (row.isSuspended === '激活') {
        msg = `暂停后，此任务不允许往后流转，您确定挂起【${row.name || row.processDefinitionKey}】吗？`
      } else {
        msg = `启动后，此任务允许往后流转，您确定激活【${row.name || row.processDefinitionKey}】吗？`
      }
      parm = {
        processInstanceId: row.processInstanceId
      }
      this.$confirm(msg).then(() => {
        this.loading = true
        return api.state(parm)
      }).then(() => {
        this.loading = false
        this.getList()
        this.msgSuccess('操作成功')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
