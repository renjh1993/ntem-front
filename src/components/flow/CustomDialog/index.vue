<template>
  <div>
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
        <el-form-item label="组件名称-英文" label-width="110px" prop="beanName">
          <el-input
            v-model="queryParams.beanName"
            placeholder="请输入组件名称-英文"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="描述-中文" prop="sdesc">
          <el-input
            v-model="queryParams.sdesc"
            placeholder="请输入描述-中文"
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
      <el-table v-loading="loading" :data="cmpCustomList" @row-click="putRowData">
        <el-table-column label="主键" align="center" prop="cmpPk" />
        <el-table-column label="修订历史" align="center" prop="revisionHisPk" />
        <el-table-column label="组件名称-英文" align="center" prop="beanName" />
        <el-table-column label="描述-中文" align="center" prop="sdesc" />
        <el-table-column label="组件类型代码" align="center" prop="cmpTypeCd" />
        <el-table-column label="组件类型名称" align="center" prop="cmpTypeNm" />
        <el-table-column label="系统ID" align="center" prop="compId" />
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getCustomList"
      />
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button type="primary">确 定</el-button>-->
<!--        <el-button>取 消</el-button>-->
<!--      </div>-->
    </el-dialog>
  </div>
</template>

<script>
  import { listCmpCustom } from "@/api/configuration/cmpCustom";
  import eventBus from "@/utils/flow/eventBus";
  export default {
    name: 'CustomDialog',
    data() {
      return {
        loading: false,
        page: {},
        node: {},
        title: null,
        open: false,
        cmpCustomList: [],
        total: 0,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          revisionHisPk: null,
          beanName: null,
          sdesc: null,
          cmpTypeCd: null,
          cmpTypeNm: null,
          compId: null,
        },
      };
    },
    created() {
      this.bindEvent()
    },
    methods: {
      getCustomList() {
        this.loading = true
        listCmpCustom(this.queryParams).then(response => {
          this.cmpCustomList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getCustomList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      bindEvent() {
        let self = this;
        eventBus.$on("nodeselectDblclick", page=> {
          self.getCustomList()
          self.title = "自定义组件"
          self.page = page;
          self.open = true
          self.node = page.target.getModel()
        })
      },
      putRowData(row, event, column) {
        // this.node.beanName = row.beanName
        this.node.label = row.sdesc
        this.open = false

        let item = {
          nodeId : this.node.id,
          beanName: row.beanName
        }
        let nodeItem = {
          node: this.node
        }
        eventBus.$emit("putCustomBeanName", {target: item})
        eventBus.$emit("afterSelectCustom", nodeItem)
      }
    }
  };
</script>


