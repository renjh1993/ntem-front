<template>
  <div class="app-container">
    <!--    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">-->
    <!--      <el-form-item label="IP地址" prop="ipAddr">-->
    <!--        <el-select style="width: 100%" v-model="queryParams.revisionHisPk" placeholder="请选择修订历史版本">-->
    <!--          <el-option v-for="item in hisList" :key="item.revisionHisPk" :label="item.revisionHisPk + '-版本号:' + item.revisionNbr" :value="item.revisionHisPk"></el-option>-->
    <!--        </el-select>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="端口号" prop="proxyIp">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.proxyIp"-->
    <!--          placeholder="请输入端口号"-->
    <!--          clearable-->
    <!--          size="small"-->
    <!--          @keyup.enter.native="handleQuery"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="地址描述" prop="portNbr">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.portNbr"-->
    <!--          placeholder="请输入地址描述"-->
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
    <!--        >新增</el-button>-->
    <!--      </el-col>-->
    <!--      <el-col :span="1.5">-->
    <!--        <el-button-->
    <!--          type="success"-->
    <!--          icon="el-icon-edit"-->
    <!--          size="mini"-->
    <!--          :disabled="single"-->
    <!--          @click="handleUpdate"-->
    <!--        >修改</el-button>-->
    <!--      </el-col>-->
    <!--      <el-col :span="1.5">-->
    <!--        <el-button-->
    <!--          type="danger"-->
    <!--          icon="el-icon-delete"-->
    <!--          size="mini"-->
    <!--          :disabled="multiple"-->
    <!--          @click="handleDelete"-->
    <!--        >删除</el-button>-->
    <!--      </el-col>-->
    <!--      <el-col :span="1.5">-->
    <!--        <el-button-->
    <!--          type="warning"-->
    <!--          icon="el-icon-download"-->
    <!--          size="mini"-->
    <!--          @click="handleExport"-->
    <!--        >导出</el-button>-->
    <!--      </el-col>-->
    <!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    <!--    </el-row>-->

    <el-table v-loading="loading" border :data="bndList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="协议ID" align="center" prop="bndProfl.bndProflId" />
      <el-table-column label="协议类型" align="center" prop="bndType">
        <template scope="scope ">
          {{ scope.row.bndProfl.bndTypeCd + '-' + scope.row.bndProfl.bndTypeNm }}
        </template>
      </el-table-column>
      <el-table-column label="地址描述" align="center" prop="sdesc" />
      <el-table-column label="IP地址" align="center" prop="ipAddr" />
      <el-table-column label="端口号" align="center" prop="portNbr" />
      <el-table-column label="URL" align="center" prop="urlStr" />
      <el-table-column label="是否代理" align="center" prop="isProxy">
        <template scope="scope">
          {{ scope.row.isProxy | transIsProxy }}
        </template>
      </el-table-column>
      <el-table-column label="代理地址" align="center" prop="proxyIp" />
      <el-table-column label="代理端口" align="center" prop="proxyPort" />
      <el-table-column label="头-类型" align="center" prop="contentType" />
      <el-table-column label="头-编码" align="center" prop="contentCharset" />
      <el-table-column label="头-长度" align="center" prop="conten tLength" />
      <el-table-column label="超时时间" align="center" prop="timeOut1" />
      <!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button-->
      <!--            size="mini"-->
      <!--            type="text"-->
      <!--            icon="el-icon-edit"-->
      <!--            @click="handleUpdate(scope.row)"-->
      <!--          >修改</el-button>-->
      <!--          <el-button-->
      <!--            size="mini"-->
      <!--            type="text"-->
      <!--            icon="el-icon-delete"-->
      <!--            @click="handleDelete(scope.row)"-->
      <!--          >删除</el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改协议访问参数对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="版本号" prop="revisionHisPk">
          <el-select v-model="form.revisionHisPk" style="width: 100%" placeholder="请选择修订历史版本">
            <el-option v-for="item in hisList" :key="item.revisionHisPk" :label="item.revisionNbr + '-' + item.markNm" :value="item.revisionHisPk" />
          </el-select>
        </el-form-item>
        <el-form-item label="主机名" prop="hostName">
          <el-input v-model="form.hostName" placeholder="请输入主机名" />
        </el-form-item>
        <el-form-item label="IP地址" prop="ipAddr">
          <el-input v-model="form.ipAddr" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="端口号" prop="portNbr">
          <el-input v-model="form.portNbr" placeholder="请输入端口号" />
        </el-form-item>
        <el-form-item label="URL" prop="urlStr">
          <el-input v-model="form.urlStr" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否代理" prop="isProxy">
          <el-select v-model="form.contentType" style="width: 100%" placeholder="请选择是否代理">
            <el-option v-for="dict in isProxySelect" :key="dict.dictValue" :label="dict.dictValue + '-' +dict.dictLabel" :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="代理IP" prop="proxyIp">
          <el-input v-model="form.proxyIp" placeholder="请输入代理IP" />
        </el-form-item>
        <el-form-item label="代理端口" prop="proxyPort">
          <el-input v-model="form.proxyPort" placeholder="请输入代理端口" />
        </el-form-item>
        <el-form-item label="超时时间1" prop="timeOut1">
          <el-input v-model="form.timeOut1" placeholder="请输入从进入TCP Output节点前到TCP Output节点完成的超时" />
        </el-form-item>
        <el-form-item label="超时时间2" prop="timeOut2">
          <el-input v-model="form.timeOut2" placeholder="请输入从TCP Output节点开始到第一个TCP Receive节点的超时" />
        </el-form-item>
        <el-form-item label="超时时间3" prop="timeOut3">
          <el-input v-model="form.timeOut3" placeholder="请输入从第一个TCP Receive节点到第二个TCP Receive节点的超时" />
        </el-form-item>
        <el-form-item label="地址描述" prop="sdesc">
          <el-input v-model="form.sdesc" placeholder="请输入地址描述" />
        </el-form-item>
        <el-form-item label="协议头-类型" prop="contentType">
          <el-select v-model="form.contentType" style="width: 100%" placeholder="请选择头信息，报文体格式application/json application/xml等">
            <el-option v-for="dict in contentTypeList" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="协议头-编码" prop="contentCharset">
          <el-select v-model="form.contentCharset" style="width: 100%" placeholder="请选择头信息编码">
            <el-option v-for="dict in contentCharsetList" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="协议头-长度" prop="contentLength">
          <el-input v-model="form.contentLength" placeholder="请输入头信息报文体长度，数字" />
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
import { getAttr, delAttr, addAttr, updateAttr, exportAttr, listBnd } from '@/api/configuration/attr'
import { listHis } from '@/api/configuration/his'

export default {
  name: 'Attr',
  filters: {
    transIsProxy: function(value) {
      if (value === 0) {
        return '否'
      } else if (value === 1) {
        return '是'
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
      // 协议访问参数表格数据
      attrList: [],
      bndList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        revisionHisPk: null,
        hostName: null,
        ipAddr: null,
        portNbr: null,
        urlStr: null,
        isProxy: null,
        proxyIp: null,
        proxyPort: null,
        funcDef: null,
        timeOut1: null,
        timeOut2: null,
        timeOut3: null,
        sdesc: null,
        contentType: null,
        contentCharset: null,
        contentLength: null
      },
      // 表单参数
      form: {},
      // 字典返回协议头类型
      contentTypeList: [],
      // 字典返回协议编码
      contentCharsetList: [],
      // 字典返回是否代理字段
      isProxySelect: [],
      // his列表
      hisList: [],
      // 表单校验
      rules: {
        revisionHisPk: [
          { required: true, message: '修订历史不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getHisList()
    this.getDicts('content_type').then(response => {
      this.contentTypeList = response.data
    })
    this.getDicts('content_charset').then(response => {
      this.contentCharsetList = response.data
    })
    this.getDicts('is_proxy').then(response => {
      this.isProxySelect = response.data
    })
  },
  methods: {
    /** 查询协议访问参数列表 */
    getList() {
      this.loading = true
      listBnd(this.queryParams).then(response => {
        this.bndList = response.data.data
        this.total = response.data.total
        this.loading = false
      })
    },
    getHisList() {
      listHis().then(response => {
        this.hisList = response.data
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
        bndProflPk: null,
        revisionHisPk: null,
        hostName: null,
        ipAddr: null,
        portNbr: null,
        urlStr: null,
        isProxy: null,
        proxyIp: null,
        proxyPort: null,
        funcDef: null,
        timeOut1: null,
        timeOut2: null,
        timeOut3: null,
        sdesc: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        contentType: null,
        contentCharset: null,
        contentLength: null
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
      this.ids = selection.map(item => item.bndProflPk)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加协议访问参数'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const bndProflPk = row.bndProflPk || this.ids
      getAttr(bndProflPk).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改协议访问参数'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.bndProflPk != null) {
            updateAttr(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addAttr(this.form).then(response => {
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
      const bndProflPks = row.bndProflPk || this.ids
      this.$confirm('是否确认删除协议访问参数编号为"' + bndProflPks + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delAttr(bndProflPks)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有协议访问参数数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportAttr(queryParams)
      }).then(response => {
        this.download(response.msg)
      })
    }
  }
}
</script>
