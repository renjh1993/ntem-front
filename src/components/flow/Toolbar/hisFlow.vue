<template>
  <el-dialog title="历史流程"   :visible.sync="hisFlowVisible" width="70%">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="流程模板名" prop="tplName">
        <el-input
          v-model="queryParams.tplName"
          placeholder="请输入流程模板名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="tplType">
        <el-select v-model="queryParams.tplType" placeholder="请选择类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="sdesc">
        <el-input
          v-model="queryParams.sdesc"
          placeholder="请输入描述"
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
    <el-table v-loading="loading" :data="hisData">
      <el-table-column label="主键" prop="flowTplPk" />
<!--      <el-table-column label="修订历史" prop="revisionHisPk"/>-->
      <el-table-column label="流程模板名" prop="tplName"/>
<!--      <el-table-column label="流程内容JSON" prop="tplContent"/>-->
      <el-table-column label="类型" prop="tplType">
        <template scope="scope">
          {{ scope.row.tplType | tplTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="当前状态" prop="tplState"/>
      <el-table-column label="描述" prop="sdesc"/>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button @click="observeFlow(scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="init"
    />
  </el-dialog>
</template>

<script>
  import eventBus from "@/utils/flow/eventBus"
  import { getFlowList } from '@/api/flow/flow'
  export default {
    name: 'hisFlow',
    // props: {
    //   data: []
    // },
    filters: {
      tplTypeFilter: function(value) {
        if (value === '01'){
          return '流程模板'
        } else if (value === '02') {
          return '交易流程'
        } else if (value === '03') {
          return '子流程'
        }
      }
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        hisFlowVisible: false,
        hisData: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        // 总条数
        total: 0,
      }
    },
    methods: {
      init() {
        this.loading = true
        getFlowList(this.queryParams).then(response =>{
          this.hisData = response.data.data
          this.total = response.data.total
          this.hisFlowVisible = true
          this.loading = false;
        })
      },
      observeFlow(row) {
        eventBus.$emit("observer-flow", row)
        this.hisFlowVisible = false
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.init();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
    }
  }
</script>

<style scoped>

</style>
