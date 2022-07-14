<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="协议类型" prop="profileType">
        <el-select v-model="queryParams.profileType" placeholder="请选择协议类型" @change="handleQuery" clearable size="small">
          <el-option :label="item.value" :value="item.value" :index="item.index" v-for="item in profileTypes" />
        </el-select>
      </el-form-item>
      <el-form-item label="端口号" prop="port">
        <el-input
          v-model="queryParams.port"
          placeholder="请输入端口号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="描述" label-width="68px" prop="sdesc">
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
          v-hasPermi="['system:attr:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:attr:edit']"
        >修改</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['system:attr:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['system:attr:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" border :data="attrList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="bndAttrPk" />
      <el-table-column label="修订历史" align="center" prop="revisionHisPk" />
      <el-table-column label="协议类型" align="center" prop="profileType" />
      <el-table-column label="主机地址" align="center" prop="host" />
      <el-table-column label="端口号" align="center" prop="port" />
      <el-table-column label="url" width="120px" align="center" prop="url" />
      <el-table-column label="请求体" align="center" prop="requestbody" />
      <el-table-column label="http请求类型" align="center" prop="httpMethod" />
      <el-table-column label="http url参数" align="center" prop="httpUrlVariables" />
      <el-table-column label="http头数据" align="center" prop="httpHeaders" />
      <el-table-column label="是否需要代理" align="center" prop="httpNeedProxy">
        <template scope="scope">
          {{ scope.row.httpNeedProxy | httpNeedProxyFil }}
        </template>
      </el-table-column>
      <el-table-column label="代理IP" align="center" prop="httpProxyIp" />
      <el-table-column label="代理端口" align="center" prop="httpProxyPort" />
      <el-table-column label="tcp编码器类" width="150px" align="center" prop="tcpEncoder" />
      <el-table-column label="tcp解码器类" width="150px" align="center" prop="tcpDecoder" />
      <el-table-column label="超时时间" align="center" prop="timeOut" />
      <el-table-column label="描述" width="120px" align="center" prop="sdesc" />
      <el-table-column label="操作" fixed="right" width="120px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:attr:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:attr:remove']"
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

    <!-- 添加或修改协议访问参数对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
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
            <el-form-item label="协议类型" prop="profileType">
              <el-select clearable v-model="form.profileType" placeholder="请选择协议类型">
                <el-option :label="item.value" :value="item.value" :index="item.index" v-for="item in profileTypes" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主机地址" prop="host">
              <el-input v-model="form.host" placeholder="请输入主机地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="端口号" prop="port">
              <el-input v-model="form.port" placeholder="请输入端口号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="url" prop="url">
              <el-input v-model="form.url" type="textarea" placeholder="请输入url" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求体" prop="requestbody">
              <el-input v-model="form.requestbody" type="textarea" placeholder="请输入请求体" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.profileType === 'http'" label="http请求类型" prop="httpMethod">
              <el-select v-model="form.httpMethod" placeholder="请选择http请求类型">
                <el-option label="get" value="get" />
                <el-option label="post" value="post" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.profileType === 'http'" label="http url参数" prop="httpUrlVariables">
              <el-input v-model="form.httpUrlVariables" placeholder="请输入http url参数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.profileType === 'http'" label="http头数据" prop="httpHeaders">
              <el-input v-model="form.httpHeaders" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否需要代理" prop="httpNeedProxy">
              <el-radio-group v-model="form.httpNeedProxy">
                <el-radio :label=0>否</el-radio>
                <el-radio :label=1>是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.httpNeedProxy === 1" label="代理IP" prop="httpProxyIp">
              <el-input v-model="form.httpProxyIp" placeholder="请输入代理IP" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.httpNeedProxy === 1" label="代理端口" prop="httpProxyPort">
              <el-input v-model="form.httpProxyPort" placeholder="请输入代理端口" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.profileType === 'tcp'" label="tcp编码器类" prop="tcpEncoder">
              <el-input v-model="form.tcpEncoder" placeholder="请输入tcp编码器类" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.profileType === 'tcp'" label="tcp解码器类" prop="tcpDecoder">
              <el-input v-model="form.tcpDecoder" placeholder="请输入tcp解码器类" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="超时时间" prop="timeOut">
              <el-input v-model="form.timeOut" placeholder="请输入超时时间" />
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
  </div>
</template>

<script>
import { listAttr, getAttr, delAttr, addAttr, updateAttr, exportAttr } from "@/api/configuration/attr";
import { listHis } from "@/api/configuration/his"

export default {
  name: "Attr",
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
      // 协议访问参数表格数据
      attrList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        revisionHisPk: null,
        profileType: null,
        host: null,
        port: null,
        url: null,
        requestbody: null,
        httpMethod: null,
        httpUrlVariables: null,
        httpHeaders: null,
        httpNeedProxy: null,
        httpProxyIp: null,
        httpProxyPort: null,
        tcpEncoder: null,
        tcpDecoder: null,
        timeOut: null,
        sdesc: null,
      },
      // his列表
      hisList: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        revisionHisPk: [
          { required: true, message: "修订历史不能为空", trigger: "blur" }
        ],
        profileType: [
          { required: true, message: "协议类型，http、https、tcp、udp不能为空", trigger: "change" }
        ],
      },
      profileTypes: [{
        index: 'http',
        value: 'http'
      },{
        index: 'https',
        value: 'https'
      },{
        index: 'tcp',
        value: 'tcp'
      },{
        index: 'udp',
        value: 'udp'
      },{
        index: 'service',
        value: 'service'
      }]
    };
  },
  filters: {
    httpNeedProxyFil: function(value) {
      if (value === 0) {
        return '否'
      } else if (value === 1) {
        return '是'
      }
    }
  },
  created() {
    this.getList();
    this.getHisList()
  },
  methods: {
    /** 查询协议访问参数列表 */
    getList() {
      this.loading = true;
      listAttr(this.queryParams).then(response => {
        this.attrList = response.data.data;
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
        bndAttrPk: null,
        revisionHisPk: null,
        profileType: null,
        host: null,
        port: null,
        url: null,
        requestbody: null,
        httpMethod: null,
        httpUrlVariables: null,
        httpHeaders: null,
        httpNeedProxy: 0,
        httpProxyIp: null,
        httpProxyPort: null,
        tcpEncoder: null,
        tcpDecoder: null,
        timeOut: null,
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
      this.ids = selection.map(item => item.bndAttrPk)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加协议访问参数";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const bndAttrPk = row.bndAttrPk || this.ids
      getAttr(bndAttrPk).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改协议访问参数";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.bndAttrPk != null) {
            updateAttr(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAttr(this.form).then(response => {
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
      const bndAttrPks = row.bndAttrPk || this.ids;
      this.$confirm('是否确认删除协议访问参数编号为"' + bndAttrPks + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAttr(bndAttrPks);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有协议访问参数数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportAttr(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
