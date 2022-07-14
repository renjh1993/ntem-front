<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="修订编号" prop="revisionNbr">
        <el-input
          v-model="queryParams.revisionNbr"
          placeholder="请输入修订编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布目的" prop="purpose">
        <el-input
          v-model="queryParams.purpose"
          placeholder="请输入发布目的"
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
          v-hasPermi="['system:his:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:his:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:his:remove']"
        >删除</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['system:his:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="hisList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="revisionHisPk" />
      <el-table-column label="修订编号" align="center" prop="revisionNbr" />
      <el-table-column label="发布目的" align="center" prop="purpose" />
      <el-table-column label="影响" align="center" prop="impact" />
      <el-table-column label="描述" align="center" prop="sdesc" />
      <el-table-column label="版本标识代码" align="center" prop="markCd" />
      <el-table-column label="版本标识名称" align="center" prop="markNm" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:his:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:his:remove']"
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

    <!-- 添加对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="主键" prop="revisionNbr">-->
<!--              <el-input v-model="form.revisionHisPk" placeholder="请输入主键" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="修订编号" prop="revisionNbr">
              <el-input v-model="form.revisionNbr" placeholder="请输入修订编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布目的" prop="purpose">
              <el-input v-model="form.purpose" placeholder="请输入发布目的" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本标识代码" prop="markCd">
              <el-input v-model="form.markCd" placeholder="请输入版本标识代码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本标识名称" prop="markNm">
              <el-input v-model="form.markNm" placeholder="请输入版本标识名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="影响" prop="impact">
              <el-input v-model="form.impact" placeholder="请输入影响" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述" prop="sdesc">
              <el-input v-model="form.sdesc" placeholder="请输入描述" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog :title="editTitle" :visible.sync="editOpen" width="500px" append-to-body>
      <el-form ref="editForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="主键" prop="revisionNbr">
          <el-input v-model="form.revisionHisPk" disabled placeholder="请输入主键" />
        </el-form-item>
        <el-form-item label="修订编号" prop="revisionNbr">
          <el-input v-model="form.revisionNbr" placeholder="请输入修订编号" />
        </el-form-item>
        <el-form-item label="发布目的" prop="purpose">
          <el-input v-model="form.purpose" placeholder="请输入发布目的" />
        </el-form-item>
        <el-form-item label="影响" prop="impact">
          <el-input v-model="form.impact" placeholder="请输入影响" />
        </el-form-item>
        <el-form-item label="描述" prop="sdesc">
          <el-input v-model="form.sdesc" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="版本标识代码" prop="markCd">
          <el-input v-model="form.markCd" placeholder="请输入版本标识代码" />
        </el-form-item>
        <el-form-item label="版本标识名称" prop="markNm">
          <el-input v-model="form.markNm" placeholder="请输入版本标识名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
        <el-button @click="editCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listHis, getHis, delHis, addHis, updateHis, exportHis } from "@/api/configuration/his";

export default {
  name: "His",
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
      hisList: [],
      // 弹出层标题
      title: "",
      editTitle: "",
      // 是否显示弹出层
      open: false,
      editOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        revisionNbr: null,
        purpose: null,
        impact: null,
        sdesc: null,
        markCd: null,
        markNm: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        revisionNbr: [{required: true, message: "修订编号不能为空", trigger: "blur"}],
        markCd: [{required: true, message: "版本标识代码不能为空", trigger: "blur"}],
        markNm: [{required: true, message: "版本标识名称不能为空", trigger: "blur"}],
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
      listHis(this.queryParams).then(response => {
        this.hisList = response.data.data;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    editCancel() {
      this.editOpen = false;
      this.editReset();
    },
    // 表单重置
    reset() {
      this.form = {
        revisionHisPk: null,
        revisionNbr: null,
        purpose: null,
        impact: null,
        sdesc: null,
        markCd: null,
        markNm: null,
        createTime: null,
        createBy: null
      };
      this.resetForm("form");
    },
    editReset() {
      this.form = {
        revisionHisPk: null,
        revisionNbr: null,
        purpose: null,
        impact: null,
        sdesc: null,
        markCd: null,
        markNm: null,
        createTime: null,
        createBy: null
      };
      this.resetForm("editForm");
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
      this.ids = selection.map(item => item.revisionHisPk)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增版本";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.editReset();
      const revisionHisPk = row.revisionHisPk || this.ids
      getHis(revisionHisPk).then(response => {
        this.form = response.data;
        this.editOpen = true;
      });
      this.editTitle = "修改版本";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addHis(this.form).then(response => {
            this.msgSuccess("新增成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    submitEditForm() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          updateHis(this.form).then(response => {
            this.msgSuccess("修改成功");
            this.editOpen = false;
            this.getList();
          });
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const revisionHisPks = row.revisionHisPk || this.ids;
      this.$confirm('是否确认删除编号为"' + revisionHisPks + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delHis(revisionHisPks);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportHis(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
