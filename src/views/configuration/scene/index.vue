<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="场景描述" prop="sdesc">
        <el-input
          v-model="queryParams.sdesc"
          placeholder="请输入场景描述"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="场景类型" prop="svcCtxTypeCd">
        <el-select style="width: 100%" v-model="queryParams.compTypeCd" placeholder="请选择场景类型">
          <el-option v-for="dict in sceneTypeList" :key="dict.dictValue" :label="dict.dictValue + '-' +dict.dictLabel" :value="dict.dictValue"></el-option>
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:ctx:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:ctx:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:ctx:remove']"
        >删除</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['system:ctx:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border v-loading="loading" :data="ctxList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="场景ID" align="center" prop="svcCtxId" />
      <el-table-column label="版本号" align="center" prop="revisionHisPk" />
      <el-table-column label="场景描述" prop="sdesc" />
      <el-table-column label="场景类型" align="center" prop="svcCtxType">
        <template scope="scope">
          {{ scope.row.svcCtxTypeCd + "-" + scope.row.svcCtxTypeNm }}
        </template>
      </el-table-column>
      <el-table-column label="场景字段" align="center" prop="elmPath" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:ctx:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:ctx:remove']"
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

    <!-- 添加或修改服务访问场景对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="修订历史" prop="revisionHisPk">
              <el-select style="width: 100%" v-model="form.revisionHisPk" placeholder="请选择修订历史版本">
                <el-option v-for="item in hisList" :key="item.revisionHisPk" :label="item.revisionNbr + '-' + item.markNm" :value="item.revisionHisPk"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场景Id" prop="svcCtxId">
              <el-input v-model="form.svcCtxId" placeholder="请输入场景Id" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中文名" prop="nameCn">
              <el-input v-model="form.nameCn" placeholder="请输入中文名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="英文名" prop="nameEn">
              <el-input v-model="form.nameEn" placeholder="请输入英文名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述" prop="sdesc">
              <el-input v-model="form.sdesc" placeholder="请输入描述" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场景类型" prop="svcCtxType">
<!--              <el-input v-model="form.svcCtxTypeCd" placeholder="请输入场景类型代码" />-->
              <el-select style="width: 100%" v-model="form.svcCtxTypeCd" @change="typeSelect(form.svcCtxTypeCd)" placeholder="请选择组件类型">
                <el-option v-for="item in svcCtxTypeList" :key="item.svcCtxTypeCd" :label="item.svcCtxTypeCd + '-' + item.svcCtxTypeNm" :value="item.svcCtxTypeCd"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-show="false" label="场景类型名称" prop="svcCtxTypeNm">
              <el-input v-model="form.svcCtxTypeNm" placeholder="请输入场景类型名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="元素PK" prop="elmPk">
              <el-input v-model="form.elmPk" placeholder="请输入元素PK" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="元素Path" prop="elmPath">
              <el-input v-model="form.elmPath" placeholder="请输入元素Path" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="正则表达式" prop="regExp">
              <el-input v-model="form.regExp" placeholder="请输入用以计算Service Context信息的正则表达式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="匹配参考值" prop="refVal">
              <el-input v-model="form.refVal" placeholder="请输入匹配参考值" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则排序" prop="ruleOrd">
              <el-input v-model="form.ruleOrd" placeholder="请输入规则排序" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCtx, getCtx, delCtx, addCtx, updateCtx, exportCtx } from "@/api/configuration/ctx";
import { listHis } from "@/api/configuration/his"

export default {
  name: "Ctx",
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
      // 服务访问场景表格数据
      ctxList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        revisionHisPk: null,
        svcCtxId: null,
        nameCn: null,
        nameEn: null,
        sdesc: null,
        svcCtxTypeCd: null,
        svcCtxTypeNm: null,
        elmPk: null,
        elmPath: null,
        regExp: null,
        refVal: null,
        ruleOrd: null,
      },
      // 场景类型列表
      sceneTypeList: [],
      // 表单参数
      form: {},
      // his列表
      hisList: [],
      // 表单校验
      rules: {
        revisionHisPk: [
          { required: true, message: "修订历史不能为空", trigger: "blur" }
        ],
      },
      svcCtxTypeList: [{
        svcCtxTypeCd: '1510',
        svcCtxTypeNm: '默认场景'
      },{
        svcCtxTypeCd: '1520',
        svcCtxTypeNm: '与TCP请求报文值相关的场景'
      },{
        svcCtxTypeCd: '1530',
        svcCtxTypeNm: '与XML请求报文值相关的场景'
      },{
        svcCtxTypeCd: '1531',
        svcCtxTypeNm: '与服务请求方相关的场景'
      },{
        svcCtxTypeCd: '1550',
        svcCtxTypeNm: '与TCP返回报文值相关的场景'
      },{
        svcCtxTypeCd: '1560',
        svcCtxTypeNm: '与XML返回报文值相关的场景'
      },{
        svcCtxTypeCd: '1570',
        svcCtxTypeNm: '与请求协议相关的相关的场景'
      },{
        svcCtxTypeCd: '1580',
        svcCtxTypeNm: '通过JS实现选择的与响应相关的场景'
      }]
    };
  },
  created() {
    this.getList();
    this.getHisList();
    this.getDicts("svc_ctx_type").then(response => {
      this.sceneTypeList = response.data;
    });
  },
  methods: {
    /** 查询服务访问场景列表 */
    getList() {
      this.loading = true;
      listCtx(this.queryParams).then(response => {
        this.ctxList = response.data.data;
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
        svcCtxPk: null,
        revisionHisPk: null,
        svcCtxId: null,
        nameCn: null,
        nameEn: null,
        sdesc: null,
        svcCtxTypeCd: null,
        svcCtxTypeNm: null,
        elmPk: null,
        elmPath: null,
        regExp: null,
        refVal: null,
        ruleOrd: null,
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
      this.ids = selection.map(item => item.svcCtxPk)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加服务访问场景";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const svcCtxPk = row.svcCtxPk || this.ids
      getCtx(svcCtxPk).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改服务访问场景";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.svcCtxPk != null) {
            updateCtx(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCtx(this.form).then(response => {
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
      const svcCtxPks = row.svcCtxPk || this.ids;
      this.$confirm('是否确认删除服务访问场景编号为"' + svcCtxPks + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCtx(svcCtxPks);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有服务访问场景数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCtx(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
    typeSelect(svcCtxTypeCd) {
      if (svcCtxTypeCd === '1510') {
        this.form.svcCtxTypeNm = '默认场景'
      } else if (svcCtxTypeCd === '1520') {
        this.form.svcCtxTypeNm = '与TCP请求报文值相关的场景'
      } else if (svcCtxTypeCd === '1530') {
        this.form.svcCtxTypeNm = '与XML请求报文值相关的场景'
      } else if (svcCtxTypeCd === '1531') {
        this.form.svcCtxTypeNm = '与服务请求方相关的场景'
      } else if (svcCtxTypeCd === '1550') {
        this.form.svcCtxTypeNm = '与TCP返回报文值相关的场景'
      } else if (svcCtxTypeCd === '1560') {
        this.form.svcCtxTypeNm = '与XML返回报文值相关的场景'
      } else if (svcCtxTypeCd === '1570') {
        this.form.svcCtxTypeNm = '与请求协议相关的相关的场景'
      } else if (svcCtxTypeCd === '1580') {
        this.form.svcCtxTypeNm = '通过JS实现选择的与响应相关的场景'
      }
    }
  }
};
</script>
