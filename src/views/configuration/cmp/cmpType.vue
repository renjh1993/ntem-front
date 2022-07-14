<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="修订历史" prop="revisionHisPk">
        <el-select style="width: 100%" @change="handleQuery" v-model="queryParams.revisionHisPk" placeholder="请选择修订历史版本">
          <el-option v-for="item in hisList" :key="item.revisionHisPk" :label="item.revisionHisPk + '-版本号:' + item.revisionNbr" :value="item.revisionHisPk"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组件类型代码" label-width="100px" prop="cmpTypeCd">
        <el-input
          v-model="queryParams.cmpTypeCd"
          placeholder="请输入组件类型代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组件类型名称" label-width="100px" prop="cmpTypeNm">
        <el-input
          v-model="queryParams.cmpTypeNm"
          placeholder="请输入组件类型名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:cmpType:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:cmpType:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:cmpType:remove']"
        >删除</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['system:cmpType:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cmpTypeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="cmpTypePk" />
      <el-table-column label="修订历史" align="center" prop="revisionHisPk" />
      <el-table-column label="组件类型代码" align="center" prop="cmpTypeCd" />
      <el-table-column label="组件类型名称" align="center" prop="cmpTypeNm" />
      <el-table-column label="描述" align="center" prop="sdesc" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:cmpType:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:cmpType:remove']"
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

    <!-- 添加或修改组件分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="修订历史" prop="revisionHisPk">
          <el-select style="width: 100%" v-model="form.revisionHisPk" placeholder="请选择修订历史版本">
            <el-option v-for="item in hisList" :key="item.revisionHisPk" :label="item.revisionNbr + '-' + item.markNm" :value="item.revisionHisPk"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组件类型代码" prop="cmpTypeCd">
          <el-input v-model="form.cmpTypeCd" placeholder="请输入组件类型代码" />
        </el-form-item>
        <el-form-item label="组件类型名称" prop="cmpTypeNm">
          <el-input v-model="form.cmpTypeNm" placeholder="请输入组件类型名称" />
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
  import { listCmpType, getCmpType, delCmpType, addCmpType, updateCmpType, exportCmpType } from "@/api/configuration/cmpType";
  import { listHis } from "@/api/configuration/his"

  export default {
    name: "CmpType",
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
        // 组件分类表格数据
        cmpTypeList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          revisionHisPk: null,
          cmpTypeCd: null,
          cmpTypeNm: null,
          sdesc: null,
        },
        // 表单参数
        form: {},
        // his列表
        hisList: [],
        // 表单校验
        rules: {
          revisionHisPk: [
            { required: true, message: "修订历史不能为空", trigger: "blur" }
          ],
          cmpTypeCd: [
            { required: true, message: "组件类型代码不能为空", trigger: "blur" }
          ],
          cmpTypeNm: [
            { required: true, message: "组件类型名称不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
      this.getHisList();
    },
    methods: {
      /** 查询组件分类列表 */
      getList() {
        this.loading = true;
        listCmpType(this.queryParams).then(response => {
          this.cmpTypeList = response.data.data;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      // 获取版本号列表
      getHisList() {
        listHis().then(response => {
          this.hisList = response.data.data
        })
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          cmpTypePk: null,
          revisionHisPk: null,
          cmpTypeCd: null,
          cmpTypeNm: null,
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
        this.ids = selection.map(item => item.cmpTypePk)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加组件分类";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const cmpTypePk = row.cmpTypePk || this.ids
        getCmpType(cmpTypePk).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改组件分类";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.cmpTypePk != null) {
              updateCmpType(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addCmpType(this.form).then(response => {
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
        const cmpTypePks = row.cmpTypePk || this.ids;
        this.$confirm('是否确认删除组件分类编号为"' + cmpTypePks + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCmpType(cmpTypePks);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有组件分类数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCmpType(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      }
    }
  };
</script>
