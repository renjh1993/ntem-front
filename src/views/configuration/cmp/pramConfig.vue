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
<!--      <el-form-item label="组件主键" prop="cmpPk">-->
<!--        <el-input-->
<!--          v-model="queryParams.cmpPk"-->
<!--          placeholder="请输入组件主键"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="参数变量-英文" prop="paraVar">-->
<!--        <el-input-->
<!--          v-model="queryParams.paraVar"-->
<!--          placeholder="请输入参数变量-英文"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="描述-中文" prop="sdesc">-->
<!--        <el-input-->
<!--          v-model="queryParams.sdesc"-->
<!--          placeholder="请输入描述-中文"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="参数类型代码(01-入参02-出参03-属性)" prop="parpTypeCd">-->
<!--        <el-input-->
<!--          v-model="queryParams.parpTypeCd"-->
<!--          placeholder="请输入参数类型代码(01-入参02-出参03-属性)"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="是否必输项0-非必输 1-必输" prop="isRequired">-->
<!--        <el-input-->
<!--          v-model="queryParams.isRequired"-->
<!--          placeholder="请输入是否必输项0-非必输 1-必输"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="参数类型名称" prop="parpTypeNm">-->
<!--        <el-input-->
<!--          v-model="queryParams.parpTypeNm"-->
<!--          placeholder="请输入参数类型名称"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="展现控件类型" prop="showType">-->
<!--        <el-select v-model="queryParams.showType" placeholder="请选择展现控件类型" clearable size="small">-->
<!--          <el-option label="请选择字典生成" value="" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="展现值范围" prop="showValue">-->
<!--        <el-input-->
<!--          v-model="queryParams.showValue"-->
<!--          placeholder="请输入展现值范围"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:pramConfig:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:pramConfig:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:pramConfig:remove']"
        >删除</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['system:pramConfig:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
<!--	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table v-loading="loading" :data="pramConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="cmpParamPk" />
      <el-table-column label="修订历史" align="center" prop="revisionHisPk" />
      <el-table-column label="组件主键" align="center" prop="cmpPk" />
      <el-table-column label="参数变量名" align="center" prop="paramVarName" />
      <el-table-column label="参数变量-英文" align="center" prop="paramVar" />
      <el-table-column label="描述-中文" align="center" prop="sdesc" />
      <el-table-column label="参数类型" align="center" prop="paramTypeCd">
        <template scope="scope">
          {{ scope.row.paramTypeCd | paramTypeCd  }}
        </template>
      </el-table-column>
      <el-table-column label="是否必输项" align="center" prop="isRequired" />
      <el-table-column label="展现控件类型" align="center" prop="showType" />
      <el-table-column label="展现值范围" align="center" prop="showValue" :show-overflow-tooltip='true'>
        <template scope="scope">
          {{ scope.row.showValue }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:pramConfig:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:pramConfig:remove']"
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

    <!-- 添加或修改组件参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="修订历史" prop="revisionHisPk">
          <el-select style="width: 100%" v-model="form.revisionHisPk" placeholder="请选择修订历史版本">
            <el-option v-for="item in hisList" :key="item.revisionHisPk" :label="item.revisionNbr + '-' + item.markNm" :value="item.revisionHisPk"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组件主键" prop="cmpPk">
          <el-input v-model="form.cmpPk" :disabled="true"/>
        </el-form-item>
        <el-form-item label="参数变量名" prop="paramVarName">
          <el-input v-model="form.paramVarName" placeholder="请输入参数变量名"/>
        </el-form-item>
        <el-form-item label="参数变量-英文" prop="paramVar">
          <el-select style="width: 100%" filterable v-model="form.paramVar" clearable>
            <el-option v-for="item in pubPropList" :key="item.propVar" :label="item.propVar" :value="item.propVar"></el-option>
          </el-select>
          <el-input v-model="form.paramVar" class="para-var" placeholder="请选择或输入参数变量"></el-input>
        </el-form-item>
        <el-form-item label="描述-中文" prop="sdesc">
          <el-input v-model="form.sdesc" placeholder="请输入描述-中文" />
        </el-form-item>
        <el-form-item label="参数类型代码" prop="paramTypeCd">
          <el-select style="width: 100%" v-model="form.paramTypeCd" @change="typeSelect(form.paramTypeCd)" placeholder="请选择参数类型代码">
            <el-option v-for="item in paraTypeDict" :key="item.dictValue" :label="item.dictLabel + '-' + item.dictValue" :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数类型名称" prop="paramTypeNm">
          <el-input disabled v-model="form.paramTypeNm" placeholder="请输入参数类型名称" />
        </el-form-item>
        <el-form-item label="是否必输项" prop="isRequired">
          <el-radio-group v-model="form.isRequired">
            <el-radio :label="'0'">是</el-radio>
            <el-radio :label="'1'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="展现控件类型" prop="showType">
          <el-select v-model="form.showType" placeholder="请选择展现控件类型">
            <el-option label="文本框-1" value="1" />
            <el-option label="下拉框-2" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="展现值范围" prop="showValue">
          <el-input v-model="form.showValue" placeholder="请输入展现值范围" />
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
import { listPramConfig, getPramConfig, delPramConfig, addPramConfig, updatePramConfig, exportPramConfig } from "@/api/configuration/pramConfig";
import { listHis } from "@/api/configuration/his";
import { listCmpPubProp } from "@/api/configuration/cmpPubProp";


export default {
  name: "PramConfig",
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
      // 组件参数配置表格数据
      pramConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        revisionHisPk: null,
        cmpPk: null,
        sdesc: null,
        parpTypeCd: null,
        isRequired: null,
        parpTypeNm: null,
        showType: null,
        showValue: null,
      },
      // 表单参数
      form: {},
      // his列表
      hisList: [],
      // 公共属性表
      pubPropList: [],
      // 代码类型字典
      paraTypeDict : [],
      // 表单校验
      rules: {
        revisionHisPk: [
          { required: true, message: "修订历史不能为空", trigger: "blur" }
        ],
      }
    };
  },
  filters: {
    paramTypeCd: function (value) {
      let paramType = ''
      if (value === '01') {
        paramType = '01-入参'
      } else if (value === '02') {
        paramType = '02-出参'
      } else {
        paramType = '03-属性'
      }
      return paramType
    }
  },
  created() {
    this.getList(this.queryParams);
    this.getHisList();
    this.getPubProp();
    this.getDicts("parp_type_cd").then(response => {
      this.paraTypeDict = response.data;
    });
  },
  methods: {
    /** 查询组件参数配置列表 */
    getList(params) {
      this.loading = true;
      if (params) {
        this.queryParams.revisionHisPk = params.revisionHisPk
        this.queryParams.cmpPk = params.cmpPk
      }
      listPramConfig(this.queryParams).then(response => {
        this.pramConfigList = response.rows;
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
    // 获取公共属性
    getPubProp() {
      listCmpPubProp().then(response => {
        this.pubPropList = response.rows
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
        cmpParaPk: null,
        revisionHisPk: null,
        cmpPk: null,
        paramVar: null,
        paramVarName: null,
        sdesc: null,
        parpTypeCd: null,
        isRequired: '1',
        parpTypeNm: null,
        showType: '1',
        showValue: null,
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
      this.ids = selection.map(item => item.cmpParaPk)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      if (this.queryParams.cmpPk){
        this.form.revisionHisPk = this.queryParams.revisionHisPk
        this.form.cmpPk = this.queryParams.cmpPk
        this.open = true;
        this.title = "添加组件参数配置";
      } else {
        this.$alert('请先选择上方组件',  '提示', {
          confirmButtonText: '确定',
          type: 'waring',
          callback: action => {
            this.$message({
              type: 'error',
              message: '未选择上方组件'
            })
          }
        })
      }

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const cmpParamPk = row.cmpParamPk || this.ids
      getPramConfig(cmpParamPk).then(response => {
        console.log(response)
        this.form = response.data;
        this.open = true;
        this.title = "修改组件参数配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.cmpParamPk != null) {
            updatePramConfig(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPramConfig(this.form).then(response => {
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
      const cmpParaPks = row.cmpParamPk || this.ids;
      this.$confirm('是否确认删除组件参数配置编号为"' + cmpParaPks + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPramConfig(cmpParaPks);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有组件参数配置数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return exportPramConfig(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    },
    // 类型代码跟随类型编号
    typeSelect(paramTypeCd) {
      if (paramTypeCd === '01') {
        this.form.paramTypeNm = '入参'
      } else if (paramTypeCd === '02') {
        this.form.paramTypeNm = '出参'
      } else if (paramTypeCd === '03') {
        this.form.paramTypeNm = '属性'
      }
    }
  }
};
</script>
<style scoped>
  .el-form-item{
    position: relative;
  }
  .el-form-item .para-var.el-input {
    position: absolute;
    top: 1px;
    left: 1px;
    bottom: 1px;
    width: 525px;
  }
  .el-form-item .para-var>>>.el-input__inner {
    height: 34px;
    line-height: 34px;
    border: 0;
  }
</style>
