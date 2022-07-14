<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
<!--      <el-form-item label="修订历史" prop="revisionHisPk">-->
<!--        <el-input-->
<!--          v-model="queryParams.revisionHisPk"-->
<!--          placeholder="请输入修订历史"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
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

<!--    <el-row :gutter="10" class="mb8">-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['system:template:add']"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['system:template:edit']"-->
<!--        >修改</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['system:template:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['system:template:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
<!--	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
<!--    </el-row>-->

    <el-table v-loading="loading" :data="templateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="flowTplPk" />
      <el-table-column label="修订历史" align="center" prop="revisionHisPk" />
      <el-table-column label="流程模板名" align="center" prop="tplName" />
      <el-table-column label="流程内容JSON" align="center" class="test" prop="tplContent" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <!-- tips悬浮提示 -->
<!--          <el-tooltip-->
<!--            placement="top"-->
<!--            v-model="scope.row.tplContent"-->
<!--            :open-delay="500"-->
<!--            effect="dark"-->
<!--            :disabled="!scope.row.showTooltip">-->
<!--            <div slot="content">{{scope.row.note}}</div>-->
<!--            <div @mouseenter="showTips($event,scope.row)" class='myNote'>{{scope.row.note}}</div>-->
<!--          </el-tooltip>-->
          {{ scope.row.tplContent }}
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="tplType" />
      <el-table-column label="当前状态" align="center" prop="tplState" />
      <el-table-column label="描述" align="center" prop="sdesc" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link target="_blank" :to="{path: '/viewFlow', query: { flowTplPk: scope.row.flowTplPk}}">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
            >查看流程</el-button>
          </router-link>
        </template>
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="eye-open"-->
<!--            @click="handleView(scope.row)"-->
<!--          >查看流程</el-button>-->
<!--&lt;!&ndash;          <router-link :to="window.location.origin +'/flow'">查看流程</router-link>&ndash;&gt;-->
<!--        </template>-->
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="修订历史" prop="revisionHisPk">
          <el-input v-model="form.revisionHisPk" placeholder="请输入修订历史" />
        </el-form-item>
        <el-form-item label="流程模板名" prop="tplName">
          <el-input v-model="form.tplName" placeholder="请输入流程模板名" />
        </el-form-item>
        <el-form-item label="流程内容JSON">
          <editor v-model="form.tplContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="类型" prop="tplType">
          <el-select v-model="form.tplType" placeholder="请选择类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="当前状态" prop="tplState">
          <el-input v-model="form.tplState" placeholder="请输入当前状态，取自字典tpl_state" />
        </el-form-item>
        <el-form-item label="描述" prop="sdesc">
          <el-input v-model="form.sdesc" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFlowList } from "@/api/flow/flow";
import Editor from '@/components/Editor';
import eventBus from "@/utils/flow/eventBus"

export default {
  name: "Flow",
  components: { Editor },
  data() {
    return {
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
      // 【请填写功能名称】表格数据
      templateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        revisionHisPk: null,
        tplName: null,
        tplContent: null,
        tplType: null,
        tplState: null,
        sdesc: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      getFlowList(this.queryParams).then(response => {
        this.templateList = response.data.data;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        flowTplPk: null,
        revisionHisPk: null,
        tplName: null,
        tplContent: null,
        tplType: null,
        tplState: null,
        sdesc: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.flowTplPk)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加【请填写功能名称】";
    },
    /** 查看按钮操作 */
    handleView(row) {
      let route = this.$router.resolve({name: "Flow", params: row})
      console.log("string", JSON.stringify(row))
      window.open(route.href, '_blank')
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.flowTplPk != null) {
            updateTemplate(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTemplate(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const flowTplPks = row.flowTplPk || this.ids;
      this.$confirm('是否确认删除【请填写功能名称】编号为"' + flowTplPks + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTemplate(flowTplPks);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有【请填写功能名称】数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTemplate(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
<style>
  /*.el-tooltip__popper{*/
  /*  max-width:600px;*/
  /*}*/
  /*.el-tooltip__popper,.el-tooltip__popper.is-dark{*/
  /*  background:rgb(48, 65, 86) !important;*/
  /*  color: #fff !important;*/
  /*  line-height: 24px;*/
  /*}*/
  .el-tooltip__popper{max-width:80%}
</style>
