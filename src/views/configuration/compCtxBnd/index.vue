<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="提供方ID" prop="compCtxBndId">
        <el-input
          v-model="queryParams.compCtxBndId"
          placeholder="请输入组件ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系统描述" prop="compDesc">
        <el-input
          v-model="queryParams.compDesc"
          placeholder="请输入系统描述"
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
        <router-link :to="{path: '/manage/compctxbnd/createComp'}">
          <el-button type="primary" size="mini" icon="el-icon-plus">新增提供方组件</el-button>
        </router-link>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:compCtxBnd:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:compCtxBnd:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          icon="el-icon-download"-->
      <!--          size="mini"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['system:compCtxBnd:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="compCtxBndList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="提供方id" align="center" prop="compCtxBndId" />
      <el-table-column label="系统号" align="center" prop="compId" />
      <el-table-column label="系统描述" align="center" prop="compDesc" />
      <el-table-column label="场景号" align="center" prop="svcCtxId" />
      <el-table-column label="场景类型" align="center" prop="ctxDesc">
        <template scope="scope">
          {{ scope.row.ctxDesc | ctxType }}
        </template>
      </el-table-column>
      <el-table-column label="协议号" align="center" prop="bndAttrPk" />
      <el-table-column label="协议描述" align="center" prop="bndAttrSdesc">
        <template scope="scope">
          {{ scope.row.bndAttr.sdesc }}
        </template>
      </el-table-column>
      <el-table-column label="INTF号段" align="center" prop="intfSeq" />
      <el-table-column label="OPT号段" align="center" prop="optSeq" />
      <el-table-column label="版本号" align="center" prop="revisionHisPk" />
      <!--      <el-table-column label="场景描述" align="center" prop="ctxDesc" />-->
      <!--      <el-table-column label="${comment}" align="center" prop="respcdeXpath" />-->
      <!--      <el-table-column label="${comment}" align="center" prop="respmsgXpath" />-->
      <!--      <el-table-column label="${comment}" align="center" prop="custMsgType" />-->
      <!--      <el-table-column label="${comment}" align="center" prop="srvrMsgType" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['system:compCtxBnd:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['system:compCtxBnd:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleAttrDetail(scope.row)"
          >协议详情</el-button>
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

    <!-- 添加或修改提供方组件对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="版本号" prop="revisionHisPk">
          <el-input v-model="form.revisionHisPk" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="系统号" prop="compId">
          <el-input v-model="form.compId" placeholder="请输入系统号" />
        </el-form-item>
        <el-form-item label="系统描述" prop="compDesc">
          <el-input v-model="form.compDesc" placeholder="请输入系统描述" />
        </el-form-item>
        <el-form-item label="场景号" prop="svcCtxId">
          <el-input v-model="form.svcCtxId" placeholder="请输入场景号" />
        </el-form-item>
        <el-form-item label="协议号" prop="bndAttrPk">
          <el-input v-model="form.bndAttrPk" placeholder="请输入协议号" />
        </el-form-item>
        <el-form-item label="INTF号段" prop="intfSeq">
          <el-input v-model="form.intfSeq" placeholder="请输入INTF号段" />
        </el-form-item>
        <el-form-item label="OPT号段" prop="optSeq">
          <el-input v-model="form.optSeq" placeholder="请输入OPT号段" />
        </el-form-item>
        <el-form-item label="场景描述" prop="ctxDesc">
          <el-input v-model="form.ctxDesc" placeholder="请输入场景描述" />
        </el-form-item>
        <!--        <el-form-item label="${comment}" prop="respcdeXpath">-->
        <!--          <el-input v-model="form.respcdeXpath" placeholder="请输入${comment}" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="${comment}" prop="respmsgXpath">-->
        <!--          <el-input v-model="form.respmsgXpath" placeholder="请输入${comment}" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="${comment}" prop="custMsgType">-->
        <!--          <el-select v-model="form.custMsgType" placeholder="请选择${comment}">-->
        <!--            <el-option label="请选择字典生成" value="" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="${comment}" prop="srvrMsgType">-->
        <!--          <el-select v-model="form.srvrMsgType" placeholder="请选择${comment}">-->
        <!--            <el-option label="请选择字典生成" value="" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 协议访问参数详情 -->
    <el-dialog title="协议详情" :visible.sync="attrOpen" width="750px" append-to-body>
      <el-form ref="attrForm" :model="attrForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="修订历史" prop="revisionHisPk">
              <el-input v-model="attrForm.revisionHisPk" placeholder="请输入修订历史" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="协议类型" prop="profileType">
              <el-select v-model="attrForm.profileType" placeholder="请选择协议类型">
                <el-option v-for="item in profileTypes" :key="item.value" :label="item.value" :value="item.value" :index="item.index" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主机地址" prop="host">
              <el-input v-model="attrForm.host" placeholder="请输入主机地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="端口号" prop="port">
              <el-input v-model="attrForm.port" placeholder="请输入端口号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="url" prop="url">
              <el-input v-model="attrForm.url" type="textarea" placeholder="请输入url" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求体" prop="requestbody">
              <el-input v-model="attrForm.requestbody" type="textarea" placeholder="请输入请求体" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="http请求类型" prop="httpMethod">
              <el-select v-model="attrForm.httpMethod" placeholder="请选择http请求类型">
                <el-option label="get" value="get" />
                <el-option label="post" value="post" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="http url参数" prop="httpUrlVariables">
              <el-input v-model="attrForm.httpUrlVariables" placeholder="请输入http url参数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="http头数据" prop="httpHeaders">
              <el-input v-model="attrForm.httpHeaders" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否需要代理" prop="httpNeedProxy">
              <el-radio-group v-model="attrForm.httpNeedProxy">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代理IP" prop="httpProxyIp">
              <el-input v-model="attrForm.httpProxyIp" placeholder="请输入代理IP" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代理端口" prop="httpProxyPort">
              <el-input v-model="attrForm.httpProxyPort" placeholder="请输入代理端口" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="tcp编码器类" prop="tcpEncoder">
              <el-input v-model="attrForm.tcpEncoder" placeholder="请输入tcp编码器类" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="tcp解码器类" prop="tcpDecoder">
              <el-input v-model="attrForm.tcpDecoder" placeholder="请输入tcp解码器类" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="超时时间" prop="timeOut">
              <el-input v-model="attrForm.timeOut" placeholder="请输入超时时间" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述" prop="sdesc">
              <el-input v-model="attrForm.sdesc" placeholder="请输入描述" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTmp, getCompCtxBnd, delCompCtxBnd, addCompCtxBnd, updateCompCtxBnd, exportCompCtxBnd } from '@/api/configuration/compCtxBnd'
import { getAttr } from '@/api/configuration/attr'

export default {
  name: 'CompCtxBnd',
  filters: {
    ctxType: function(value) {
      if (value === '1510') {
        return '1510-默认场景'
      } else if (value === '1520') {
        return '1520-与TCP请求报文值相关的场景'
      } else if (value === '1530') {
        return '1530-与XML请求报文值相关的场景'
      } else if (value === '1531') {
        return '1531-与服务请求方相关的场景'
      } else if (value === '1550') {
        return '1550-与TCP返回报文值相关的场景'
      } else if (value === '1560') {
        return '1560--与XML返回报文值相关的场景'
      } else if (value === '1570') {
        return '1570-与请求协议相关的相关的场景'
      } else if (value === '1580') {
        return '1580-通过JS实现选择的与响应相关的场景'
      }
    }
  },
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
      // 提供方组件表格数据
      compCtxBndList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        revisionHisPk: null,
        compId: null,
        compDesc: null,
        svcCtxId: null,
        bndAttrPk: null,
        intfSeq: null,
        optSeq: null,
        ctxDesc: null,
        respcdeXpath: null,
        respmsgXpath: null,
        custMsgType: null,
        srvrMsgType: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      attrForm: {},
      attrOpen: false,
      profileTypes: [{
        index: 'http',
        value: 'http'
      }, {
        index: 'https',
        value: 'https'
      }, {
        index: 'tcp',
        value: 'tcp'
      }, {
        index: 'udp',
        value: 'udp'
      }, {
        index: 'service',
        value: 'service'
      }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询提供方组件列表 */
    getList() {
      this.loading = true
      // listCompCtxBnd(this.queryParams).then(response => {
      //   this.compCtxBndList = response.data.data;
      //   this.total = response.data.total;
      //   this.loading = false;
      // });
      listTmp(this.queryParams).then(response => {
        this.compCtxBndList = response.data.data
        this.total = response.data.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        compCtxBndId: null,
        revisionHisPk: null,
        compId: null,
        compDesc: null,
        svcCtxId: null,
        bndAttrPk: null,
        intfSeq: null,
        optSeq: null,
        ctxDesc: null,
        respcdeXpath: null,
        respmsgXpath: null,
        createTime: null,
        custMsgType: null,
        srvrMsgType: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.compCtxBndId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加提供方组件'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const compCtxBndId = row.compCtxBndId || this.ids
      getCompCtxBnd(compCtxBndId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改提供方组件'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.compCtxBndId != null) {
            updateCompCtxBnd(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addCompCtxBnd(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const compCtxBndIds = row.compCtxBndId || this.ids
      this.$confirm('是否确认删除提供方组件编号为"' + compCtxBndIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delCompCtxBnd(compCtxBndIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有提供方组件数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportCompCtxBnd(queryParams)
      }).then(response => {
        this.download(response.msg)
      })
    },
    /** 协议详情按钮操作 */
    handleAttrDetail(row) {
      this.resetAttr()
      const bndAttrPk = row.bndAttrPk
      getAttr(bndAttrPk).then(response => {
        this.attrForm = response.data
        this.attrOpen = true
      })
    },
    resetAttr() {
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
      }
      this.resetForm('attrForm')
    }
  }
}
</script>
