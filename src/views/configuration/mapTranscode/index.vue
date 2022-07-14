<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="渠道编码" prop="channelCode">
        <el-input
          v-model="queryParams.channelCode"
          placeholder="请输入渠道编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="bean名" prop="serviceName">
        <el-input
          v-model="queryParams.serviceName"
          placeholder="请输入处理service的bean名，默认为类名首字母小写"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="交易描述" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入交易描述"
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="transcodeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="渠道编码" align="center" prop="channelCode" />
      <el-table-column label="外部交易码" align="center" prop="transCode" />
      <el-table-column label="内部交易码" align="center" prop="dfspTransCode" />
      <el-table-column label="处理service的bean名，默认为类名首字母小写" align="center" prop="serviceName" />
      <el-table-column label="交易描述" align="center" prop="description" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:transcode:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:transcode:remove']"
          >删除</el-button>
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

    <!-- 添加或修改内外交易码映射对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
        <el-form-item label="渠道编码" prop="channelCode">
          <el-input v-model="form.channelCode" placeholder="请输入渠道编码" />
        </el-form-item>
        <el-form-item label="外部交易码" prop="transCode">
          <el-input v-model="form.transCode" placeholder="请输入外部交易码" />
        </el-form-item>
        <el-form-item label="内部交易码" prop="dfspTransCode">
          <el-input v-model="form.dfspTransCode" placeholder="请输入内部交易码" />
        </el-form-item>
        <el-form-item label="bean名" prop="serviceName">
          <el-input v-model="form.serviceName" placeholder="请输入处理service的bean名，默认为类名首字母小写" />
        </el-form-item>
        <el-form-item label="交易描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入交易描述" />
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
import { listTranscode, getTranscode, delTranscode, addTranscode, updateTranscode, exportTranscode } from "@/api/configuration/transcode";

export default {
  name: "Transcode",
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
      // 内外交易码映射表格数据
      transcodeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        channelCode: null,
        transCode: null,
        dfspTransCode: null,
        serviceName: null,
        description: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        channelCode: [
          { required: true, message: "渠道编码不能为空", trigger: "blur" }
        ],
        transCode: [
          { required: true, message: "外部交易码不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询内外交易码映射列表 */
    getList() {
      this.loading = true;
      listTranscode(this.queryParams).then(response => {
        this.transcodeList = response.data.data;
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
        id: null,
        channelCode: null,
        transCode: null,
        dfspTransCode: null,
        serviceName: null,
        description: null,
        updateTime: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加内外交易码映射";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTranscode(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改内外交易码映射";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTranscode(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTranscode(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除内外交易码映射编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTranscode(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有内外交易码映射数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTranscode(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
