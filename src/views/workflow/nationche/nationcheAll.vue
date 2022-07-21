<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="社区名称" prop="title">
        <el-input
          v-model="queryParams.chename"
          placeholder="请输入社区名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in stateOptions"
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
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['workflow:nationche:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="nationcheList" >
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="主键ID" align="center" prop="id" />-->
      <el-table-column label="社区名称" align="center" prop="chename"/>
      <el-table-column label="所属市" align="center" prop="city"/>
      <el-table-column label="县（市、区）" align="center" prop="county"/>
      <el-table-column label="所在乡（镇、办）" align="center" prop="township"/>
      <el-table-column label="总人口（人）" align="center" prop="gp"/>
      <el-table-column label="少数民族人口（人）" align="center" prop="emp"/>
      <el-table-column label="年人均收入（元）" align="center" prop="gni"/>
      <el-table-column label="年份" align="center" prop="year"/>
      <el-table-column label="审批意见" align="center" prop="opinion"/>
      <el-table-column label="说明" align="center" prop="explain"/>

      <el-table-column label="状态" align="center" prop="state" :formatter="stateFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="historyFory(scope.row)"
          >审批详情
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

    <approvalForm ref="approvalForm" :businessKey = 'businessKey' :processInstanceId = 'instanceId'/>
  </div>
</template>

<script>
  import {listNationChe, exportNationChe} from '@/api/workflow/nationche'
  import  approvalForm from "@/views/components/approvalForm";

  export default {
    name: 'NationCHE',
    components:{approvalForm},
    data() {
      return {
        businessKey:'',
        //用户信息
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
        open2:false,
        // 请假类型字典
        // typeOptions: [],
        // 状态字典
        stateOptions: [],
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

      }
    },
    created() {
      this.getList()
      // this.getDicts('activiti_leave_type').then(response => {
      //   this.typeOptions = response.data
      // })
      this.getDicts('activiti_flow_type').then(response => {
        this.stateOptions = response.data
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
      stateFormat(row, column) {
        return this.selectDictLabel(this.stateOptions, row.state)
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

      /** 审批详情 */
      historyFory(row) {
       this.instanceId = row.instanceId
       this.businessKey = row.id
       console.log(this.instanceId)
       this.$refs.approvalForm.visible = true
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
    }
  }
</script>
