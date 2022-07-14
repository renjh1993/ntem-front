<template>
  <el-dialog :title="title" :visible.sync="bndListVisible"  append-to-body width="70%">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="组件ID" prop="compCtxBndId">
        <el-input
          v-model="queryParams.compCtxBndId"
          placeholder="请输入组件ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系统描述" prop="compDesc">
        <el-input
          v-model="queryParams.compDesc"
          placeholder="请输入系统描述"
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
    <el-table v-loading="loading" :data="compCtxBndList" @row-click="selectRow" highlight-current-row>
      <el-table-column label="提供方id" align="center" prop="compCtxBndId" />
      <el-table-column label="系统号" align="center" prop="compId" />
      <el-table-column label="系统描述" align="center" prop="compDesc" />
      <el-table-column label="场景号" align="center" prop="svcCtxId" />
      <el-table-column label="场景类型" align="center" prop="ctxDesc">
        <template scope="scope">
          {{ scope.row.ctxDesc | ctxType }}
        </template>
      </el-table-column>
      <el-table-column label="协议号" align="center" prop="bndAttrPk" />
      <el-table-column label="协议描述" align="center" prop="bndAttrSdesc">
        <template scope="scope">
          {{ scope.row.bndAttr.sdesc }}
        </template>
      </el-table-column>
      <el-table-column label="主机地址" align="center" prop="bndAttrSdesc">
        <template scope="scope">
          {{ scope.row.bndAttr.host }}
        </template>
      </el-table-column>
      <el-table-column label="url" align="center" prop="bndAttrSdesc">
        <template scope="scope">
          {{ scope.row.bndAttr.url }}
        </template>
      </el-table-column>
      <el-table-column label="端口号" align="center" prop="bndAttrSdesc">
        <template scope="scope">
          {{ scope.row.bndAttr.port }}
        </template>
      </el-table-column>
      <el-table-column label="超时时间" align="center" prop="bndAttrSdesc">
        <template scope="scope">
          {{ scope.row.bndAttr.timeOut }}
        </template>
      </el-table-column>
      <el-table-column label="INTF号段" align="center" prop="intfSeq" />
      <el-table-column label="OPT号段" align="center" prop="optSeq" />
      <el-table-column label="版本号" align="center" prop="revisionHisPk" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getCompCtxBndList"
    />
  </el-dialog>
</template>

<script>
  import { listCompCtxBnd, listTmp, getCompCtxBnd } from "@/api/configuration/compCtxBnd";
  import eventBus from '../../../utils/flow/eventBus'
  export default {
    name: 'BndDia',
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 提供方组件表格数据
        compCtxBndList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          revisionHisPk: null,
          compId: null,
          compDesc: null,
          svcCtxId: null,
          bndAttrPk: null,
          intfSeq: null,
          optSeq: null,
          ctxDesc: null,
          respcdeXpath: null,
          respmsgXpath: null,
          custMsgType: null,
          srvrMsgType: null
        },
        bndListVisible: false,
        title: null
      }
    },
    filters: {
      ctxType: function(value) {
        if (value === '1510') {
          return '1510-默认场景'
        } else if (value === '1520') {
          return '1520-与TCP请求报文值相关的场景'
        } else if (value === '1530') {
          return '1530-与XML请求报文值相关的场景'
        } else if (value === '1531') {
          return '1531-与服务请求方相关的场景'
        } else if (value === '1550') {
          return '1550-与TCP返回报文值相关的场景'
        } else if (value === '1560') {
          return '1560--与XML返回报文值相关的场景'
        } else if (value === '1570') {
          return '1570-与请求协议相关的相关的场景'
        } else if (value === '1580') {
          return '1580-通过JS实现选择的与响应相关的场景'
        }
      }
    },
    created() {
    },
    methods: {
      getCompCtxBndList() {
        listTmp(this.queryParams).then(response => {
          this.compCtxBndList = response.data.data;
          this.total = response.data.total;
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getCompCtxBndList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      openBndListDia(selectTerm) {
        if (selectTerm) {
          console.log(52111621, selectTerm)
          this.queryParams.compId = selectTerm.compId
          this.queryParams.ctxDesc = selectTerm.ctxType
          this.title = '通讯协议提供方'
          this.showSearch = false
        } else {
          this.title = "提供方"
          this.showSearch = true
        }
        this.loading = true
        listTmp(this.queryParams).then(response => {
          this.bndListVisible = true
          this.compCtxBndList = response.data.data;
          this.total = response.data.total;
          this.loading = false
        });
      },
      selectRow(row, event, column) {
        this.bndListVisible = false
        this.$emit('rowData', row)
      }
    }
  }
</script>

<style scoped>

</style>
