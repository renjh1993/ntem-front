<template>
  <div class="app-container">
<!--    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">-->
<!--      <el-form-item label="修订历史" prop="revisionHisPk">-->
<!--        <el-input-->
<!--          v-model="queryParams.revisionHisPk"-->
<!--          placeholder="请输入修订历史"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="服务访问场景" prop="svcCtxPk">-->
<!--        <el-input-->
<!--          v-model="queryParams.svcCtxPk"-->
<!--          placeholder="请输入服务访问场景"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="中文名" prop="nameCn">-->
<!--        <el-input-->
<!--          v-model="queryParams.nameCn"-->
<!--          placeholder="请输入中文名"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="英文名" prop="nameEn">-->
<!--        <el-input-->
<!--          v-model="queryParams.nameEn"-->
<!--          placeholder="请输入英文名"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="描述" prop="sdesc">-->
<!--        <el-input-->
<!--          v-model="queryParams.sdesc"-->
<!--          placeholder="请输入描述"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="报文转换规则组类型代码" prop="transfRgTypeCd">-->
<!--        <el-input-->
<!--          v-model="queryParams.transfRgTypeCd"-->
<!--          placeholder="请输入报文转换规则组类型代码"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="报文转换规则组类型名称" prop="transfRgTypeNm">-->
<!--        <el-input-->
<!--          v-model="queryParams.transfRgTypeNm"-->
<!--          placeholder="请输入报文转换规则组类型名称"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="源报文格式类型代码" prop="srcFormatTypeCd">-->
<!--        <el-input-->
<!--          v-model="queryParams.srcFormatTypeCd"-->
<!--          placeholder="请输入源报文格式类型代码"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="源报文格式类型名称" prop="srcFormatTypeNm">-->
<!--        <el-input-->
<!--          v-model="queryParams.srcFormatTypeNm"-->
<!--          placeholder="请输入源报文格式类型名称"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="目标报文格式类型代码" prop="targetFormatTypeCd">-->
<!--        <el-input-->
<!--          v-model="queryParams.targetFormatTypeCd"-->
<!--          placeholder="请输入目标报文格式类型代码"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="目标报文格式类型名" prop="targetFormatTypeNm">-->
<!--        <el-input-->
<!--          v-model="queryParams.targetFormatTypeNm"-->
<!--          placeholder="请输入目标报文格式类型名"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="记录Id" prop="rowId">-->
<!--        <el-input-->
<!--          v-model="queryParams.rowId"-->
<!--          placeholder="请输入记录Id"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="服务Id" prop="svcId">-->
<!--        <el-input-->
<!--          v-model="queryParams.svcId"-->
<!--          placeholder="请输入服务Id"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="服务名称" prop="svcName">-->
<!--        <el-input-->
<!--          v-model="queryParams.svcName"-->
<!--          placeholder="请输入服务名称"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="前置函数" prop="preExeImpl">-->
<!--        <el-input-->
<!--          v-model="queryParams.preExeImpl"-->
<!--          placeholder="请输入前置函数"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="后置函数" prop="postExeImpl">-->
<!--        <el-input-->
<!--          v-model="queryParams.postExeImpl"-->
<!--          placeholder="请输入后置函数"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->

<!--    <el-row :gutter="10" class="mb8">-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['system:rg:add']"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['system:rg:edit']"-->
<!--        >修改</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['system:rg:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['system:rg:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
<!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
<!--    </el-row>-->

    <el-table v-loading="loading" :data="rgList" @selection-change="handleSelectionChange">
<!--      <el-table-column type="selection" width="55" align="center" />-->
<!--      <el-table-column label="后置函数" align="center" prop="transfRgPk" />-->
      <el-table-column label="修订历史" align="center" prop="revisionHisPk" />
      <el-table-column label="服务访问场景" align="center" prop="svcCtxPk" />
      <el-table-column label="中文名" align="center" prop="nameCn" />
<!--      <el-table-column label="英文名" align="center" prop="nameEn" />-->
      <el-table-column label="描述" align="center" prop="sdesc" />
      <el-table-column label="报文转换规则类型代码" align="center" prop="transfRgTypeCd" />
      <el-table-column label="报文转换规则类型名称" align="center" prop="transfRgTypeNm">
        <template scope="scope">
          {{ scope.row.transfRgTypeNm | transfRgType }}
        </template>
      </el-table-column>
      <el-table-column label="源报文格式类型代码" align="center" prop="srcFormatTypeCd" />
      <el-table-column label="源报文格式类型名称" align="center" prop="srcFormatTypeNm" />
      <el-table-column label="目标报文格式类型代码" align="center" prop="targetFormatTypeCd" />
      <el-table-column label="目标报文格式类型名" align="center" prop="targetFormatTypeNm" />
<!--      <el-table-column label="记录Id" align="center" prop="rowId" />-->
      <el-table-column label="服务Id" align="center" prop="svcId" />
<!--      <el-table-column label="服务名称" align="center" prop="svcName" />-->
<!--      <el-table-column label="前置函数" align="center" prop="preExeImpl" />-->
<!--      <el-table-column label="后置函数" align="center" prop="postExeImpl" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:rg:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:rg:remove']"
          >删除</el-button>
<!--          <router-link :to="{path: '/intf/newMsg', query: {transfRgPk: scope.row.transfRgPk}}">-->
<!--            <el-button-->
<!--              size="mini"-->
<!--              type="text"-->
<!--              icon="el-icon-plus"-->
<!--            >报文格式转换明细</el-button>-->
<!--          </router-link>-->
          <router-link :to="{path: '/msg', query: { rgData : scope.row }}">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
            >报文格式转换明细</el-button>
          </router-link>
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

    <!-- 添加或修改INTF报文转换规则组对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="860px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="修订历史" prop="revisionHisPk">
              <el-input v-model="form.revisionHisPk" placeholder="请输入修订历史" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务访问场景" prop="svcCtxPk">
              <el-select v-model="form.svcCtxPk" clearable filterable placeholder="请选择服务访问场景">
                <el-option v-for="item in ctxList" :value="item.svcCtxId" :label="item.svcCtxId + '-' + item.sdesc"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中文名" prop="nameCn">
              <el-input v-model="form.nameCn" placeholder="请输入中文名" />
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="英文名" prop="nameEn">-->
<!--              <el-input v-model="form.nameEn" placeholder="请输入英文名" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="描述" prop="sdesc">
              <el-input v-model="form.sdesc" placeholder="请输入描述" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报文转换规则组类型" prop="transfRgTypeCd">
              <el-select v-model="form.transfRgTypeNm" @input="selectRgType" placeholder="请选择报文转换规则" @change="handleSelectRg(form.transfRgTypeCd)">
                <el-option v-for="(item,index) in transfRgTypes" :key="index" :value="index" :label="item.value + ' ' + item.label"/>
              </el-select>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="报文转换规则组类型名称" prop="transfRgTypeNm">-->
<!--              <el-input v-model="form.transfRgTypeNm" :disabled="true" placeholder="请输入报文转换规则组类型名称" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="源报文格式类型" prop="srcFormatTypeCd">
              <el-select :disabled="srcDis" v-model="form.srcFormatTypeNm" @input="selectSrcType" placeholder="请选择源报文格式类型">
                <el-option v-for="(item,index) in srcFormatTypes" :key="index" :value="index" :label="item.value + '-' + item.label"/>
              </el-select>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--              <el-form-item label="源报文格式类型名称" prop="srcFormatTypeNm">-->
<!--                <el-input v-model="form.srcFormatTypeNm" placeholder="请输入源报文格式类型名称" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
          <el-col :span="12">
            <el-form-item label="目标报文格式类型" prop="targetFormatTypeCd">
              <el-select :disabled="targetDis" v-model="form.targetFormatTypeNm" @input="selectTarType" placeholder="请选择目标报文格式类型">
                <el-option v-for="(item,index) in srcFormatTypes" :key="index" :value="index" :label="item.value + '-' + item.label"/>
              </el-select>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="目标报文格式类型名" prop="targetFormatTypeNm">-->
<!--              <el-input v-model="form.targetFormatTypeNm" placeholder="请输入目标报文格式类型名" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="记录Id" prop="rowId">-->
<!--              <el-input v-model="form.rowId" placeholder="请输入记录Id" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="服务Id" prop="svcId">
              <el-input v-model="form.svcId" :disabled="true" placeholder="请输入服务Id" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务名称" prop="svcName">
              <el-input v-model="form.svcName" :disabled="true" placeholder="请输入服务名称" />
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="前置函数" prop="preExeImpl">-->
<!--              <el-input v-model="form.preExeImpl" placeholder="请输入前置函数" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="后置函数" prop="postExeImpl">-->
<!--              <el-input v-model="form.postExeImpl" placeholder="请输入后置函数" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
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
  import { listRg, getRg, delRg, addRg, updateRg, exportRg } from "@/api/configuration/rg";
  import { listCtx } from "@/api/configuration/ctx";

  export default {
    name: "TransfRg",
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
        // INTF报文转换规则组表格数据
        rgList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          revisionHisPk: null,
          svcCtxPk: null,
          nameCn: null,
          nameEn: null,
          sdesc: null,
          transfRgTypeCd: null,
          transfRgTypeNm: null,
          srcFormatTypeCd: null,
          srcFormatTypeNm: null,
          targetFormatTypeCd: null,
          targetFormatTypeNm: null,
          rowId: null,
          svcId: null,
          svcName: null,
          preExeImpl: null,
          postExeImpl: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          revisionHisPk: [
            { required: true, message: "历史流程不能为空", trigger: "blur" }
          ],
          nameCn: [
            { required: true, message: "名字不能为空", trigger: "blur" }
          ],
          svcCtxPk: [
            { required: true, message: "服务访问场景不能为空", trigger: "blur" }
          ],
          transfRgTypeCd: [
            { required: true, message: "报文转换规则不能为空", trigger: "blur" }
          ],
          srcFormatTypeCd: [
            { required: true, message: "源报文格式类型不能为空", trigger: "blur" }
          ],
          targetFormatTypeCd: [
            { required: true, message: "目标报文格式类型不能为空", trigger: "blur" }
          ]
        },
        // 场景列表
        ctxList : [],
        // 报文转换规则
        transfRgTypes : [{
          value: '151',
          label: 'c->p'
        }, {
          value: '162',
          label: 'p->c'
        }, {
          value: '152',
          label: 'p->s'
        }, {
          value: '161',
          label: 's->p'
        }],
        // 报文类型
        srcFormatTypes : [{
          value : '110',
          label: 'JSON'
        }, {
          value : '120',
          label: '分隔符'
        },{
          value: '150',
          label: 'TCP定长'
        }, {
          value: '160',
          label: 'XML'
        }, {
          value: '170',
          label: 'MQ'
        }, {
          value: '180',
          label: 'CSV逗号分隔符'
        }, {
          value: '190',
          label: '8583'
        }],
        targetDis: false,
        srcDis: false
      };
    },
    filters: {
      transfRgType: function(value) {
        if (value === 'c-&gt;p') {
          return 'c->p'
        } else if (value === 'p-&gt;c') {
          return 'p->c'
        } else if (value === 'p-&gt;s') {
          return 'p->s'
        } else if (value === 's-&gt;p') {
          return 's->p'
        }
      }
    },
    created() {
      this.getList();
      this.getCtxList();
    },
    methods: {
      /** 查询INTF报文转换规则组列表 */
      getList() {
        this.loading = true;
        listRg(this.queryParams).then(response => {
          this.rgList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      getRgList(svcId) {
        this.loading = true;
        this.queryParams.svcId = svcId
        listRg(this.queryParams).then(response => {
          this.rgList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      getCtxList() {
        listCtx().then(response => {
          this.ctxList = response.data.data;
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
          transfRgPk: null,
          revisionHisPk: null,
          svcCtxPk: this.ctxList[0].svcCtxId,
          nameCn: null,
          nameEn: null,
          sdesc: null,
          transfRgTypeCd: null,
          transfRgTypeNm: null,
          srcFormatTypeCd: null,
          srcFormatTypeNm: null,
          targetFormatTypeCd: null,
          targetFormatTypeNm: null,
          rowId: null,
          svcId: null,
          svcName: null,
          createTime: null,
          createBy: null,
          updateTime: null,
          updateBy: null,
          preExeImpl: null,
          postExeImpl: null
        };
        this.srcDis = false
        this.targetDis = false
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
        this.ids = selection.map(item => item.transfRgPk)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加INTF报文转换规则组";
      },
      addRg(intf) {
        this.reset();
        this.open = true;
        this.form.revisionHisPk = intf.revisionHisPk
        this.form.svcId = intf.intfId
        this.form.svcName = intf.nameCn
        this.form.nameCn = intf.nameCn
        this.title = "添加INTF报文转换规则组";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const transfRgPk = row.transfRgPk || this.ids
        getRg(transfRgPk).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改INTF报文转换规则组";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.transfRgPk != null) {
              updateRg(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addRg(this.form).then(response => {
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
        const transfRgPks = row.transfRgPk || this.ids;
        this.$confirm('是否确认删除INTF报文转换规则组编号为"' + transfRgPks + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRg(transfRgPks);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有INTF报文转换规则组数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRg(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      },
      selectRgType(index) {
        this.form.transfRgTypeCd = this.transfRgTypes[index].value
        this.form.transfRgTypeNm = this.transfRgTypes[index].label
      },
      // clearRgType() {
      //   this.form.transfRgTypeCd = null
      //   this.form.transfRgTypeNm = null
      // },
      selectSrcType(index) {
        this.form.srcFormatTypeCd = this.srcFormatTypes[index].value
        this.form.srcFormatTypeNm = this.srcFormatTypes[index].label
      },
      selectTarType(index) {
        this.form.targetFormatTypeCd = this.srcFormatTypes[index].value
        this.form.targetFormatTypeNm = this.srcFormatTypes[index].label
      },
      handleSelectRg(value) {
        if (value === '151' || value === '161') {
          this.form.srcFormatTypeCd = null
          this.form.srcFormatTypeNm = null
          this.form.targetFormatTypeCd = '100'
          this.form.targetFormatTypeNm = 'FML'
          this.targetDis = true
          this.srcDis = false
        } else if (value === '152' || value === '162'){
          this.form.srcFormatTypeCd = '100'
          this.form.srcFormatTypeNm = 'FML'
          this.form.targetFormatTypeCd = null
          this.form.targetFormatTypeNm = null
          this.targetDis = false
          this.srcDis = true
        }
      }
    }
  };
</script>
