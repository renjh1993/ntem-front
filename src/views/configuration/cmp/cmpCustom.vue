<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:cmpCustom:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:cmpCustom:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:cmpCustom:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
<!--        <el-button-->
<!--          type="warning"-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['system:cmpCustom:export']"-->
<!--        >导出</el-button>-->
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cmpCustomList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="cmpPk" />
      <el-table-column label="修订历史" align="center" prop="revisionHisPk" />
      <el-table-column label="组件名称-英文" align="center" prop="beanName" />
      <el-table-column label="描述-中文" align="center" prop="sdesc" />
      <el-table-column label="组件类型代码" align="center" prop="cmpTypeCd" />
      <el-table-column label="组件类型名称" align="center" prop="cmpTypeNm" />
      <el-table-column label="系统ID" align="center" prop="compId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:cmpCustom:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:cmpCustom:remove']"
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

    <!-- 添加或修改自定义组件对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="修订历史" prop="revisionHisPk">
          <el-select style="width: 100%" v-model="form.revisionHisPk" placeholder="请选择修订历史版本">
            <el-option v-for="item in hisList" :key="item.revisionHisPk" :label="item.revisionNbr + '-' + item.markNm" :value="item.revisionHisPk"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组件名称-英文" prop="beanName">
          <el-input v-model="form.beanName" placeholder="请输入组件名称-英文" />
        </el-form-item>
        <el-form-item label="描述-中文" prop="sdesc">
          <el-input v-model="form.sdesc" placeholder="请输入描述-中文" />
        </el-form-item>
        <el-form-item label="组件类型" prop="cmpType">
          <el-input disabled placeholder="180-自定义组件" />
        </el-form-item>
        <el-form-item label="系统" prop="compId">
          <el-select style="width: 100%" v-model="form.compId" placeholder="请选择系统">
            <el-option v-for="item in compList" :key="item.compId" :label="item.compId + '-' + item.nameCn" :value="item.compId"></el-option>
          </el-select>
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
import { listCmpCustom, getCmpCustom, delCmpCustom, addCmpCustom, updateCmpCustom, exportCmpCustom } from "@/api/configuration/cmpCustom";
import { listHis } from "@/api/configuration/his"
import { listComp } from "@/api/configuration/comp"

export default {
  name: "CmpCustom",
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
      // 自定义组件表格数据
      cmpCustomList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
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
      // 表单参数
      form: {},
      // his列表
      hisList: [],
      // 系统列表
      compList: [],
      // 表单校验
      rules: {
        revisionHisPk: [
          { required: true, message: "修订历史不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getHisList();
    this.getCompList();
  },
  methods: {
    /** 查询自定义组件列表 */
    getList() {
      this.loading = true;
      listCmpCustom(this.queryParams).then(response => {
        this.cmpCustomList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 获取版本号列表
    getHisList() {
      listHis().then(response => {
        this.hisList = response.data.data
      })
    },
    // 获取系统列表
    getCompList() {
      listComp().then(response => {
        this.compList = response.data.data
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
        cmpPk: null,
        revisionHisPk: null,
        beanName: null,
        sdesc: null,
        cmpTypeCd: null,
        cmpTypeNm: null,
        compId: null,
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
      this.ids = selection.map(item => item.cmpPk)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.form.cmpTypeCd = '180'
      this.form.cmpTypeNm = '自定义类型'
      this.title = "添加自定义组件";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const cmpPk = row.cmpPk || this.ids
      getCmpCustom(cmpPk).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改自定义组件";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.cmpPk != null) {
            updateCmpCustom(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCmpCustom(this.form).then(response => {
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
      const cmpPks = row.cmpPk || this.ids;
      this.$confirm('是否确认删除自定义组件编号为"' + cmpPks + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCmpCustom(cmpPks);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有自定义组件数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCmpCustom(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
