<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="服务接口ID" label-width="84px" prop="intfId">
        <el-input
          v-model="queryParams.intfId"
          placeholder="请输入服务接口ID，六位编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="中文名" prop="nameCn">
        <el-input
          v-model="queryParams.nameCn"
          placeholder="请输入中文名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="英文名" prop="nameEn">
        <el-input
          v-model="queryParams.nameEn"
          placeholder="请输入英文名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="是否透传" prop="busiType">-->
      <!--        <el-select v-model="queryParams.busiType" placeholder="请选择是否透传" clearable size="small">-->
      <!--          <el-option label="否" value="0" />-->
      <!--          <el-option label="是" value="1" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="流程模板PK" label-width="90px" prop="flowTplPk">
        <el-select v-model="queryParams.flowTplPk" style="width: 100%" clearable filterable placeholder="请选择流程模板">
          <el-option v-for="item in flowList" :key="item.flowTplPk" :label="item.tplName" :value="item.flowTplPk" />
        </el-select>
      </el-form-item>
      <el-form-item label="版本" label-width="50px" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入版本"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务活跃级别" prop="actLevel" label-width="110px">
        <el-select v-model="queryParams.actLevel" placeholder="数字越大,级别越高" clearable size="small" @change="handleQuery">
          <el-option label="1" value="1" />
          <el-option label="2" value="2" />
          <el-option label="3" value="3" />
          <el-option label="4" value="4" />
          <el-option label="5" value="5" />
          <el-option label="6" value="6" />
          <el-option label="7" value="7" />
          <el-option label="8" value="8" />
          <el-option label="9" value="9" />
        </el-select>
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
          v-hasPermi="['system:intf:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:intf:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:intf:remove']"
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
      <!--          v-hasPermi="['system:intf:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" highlight-current-row :data="intfList" @row-click="clickRg" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="25" align="center" />
      <!--      <el-table-column label="主键" align="center" prop="svcIntfPk" />-->
      <el-table-column label="修订历史" align="center" prop="revisionHisPk" />
      <el-table-column label="服务接口ID" align="center" prop="intfId" />
      <el-table-column label="中文名" align="center" prop="nameCn" />
      <!--      <el-table-column label="英文名" align="center" prop="nameEn" />-->
      <!--      <el-table-column label="是否透传" align="center" prop="busiType">-->
      <!--        <template scope="scope">-->
      <!--          {{ scope.row.busiType | busiTypeFil }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="流程模板PK" align="center" prop="flowTplPk" />
      <!--      <el-table-column label="版本" align="center" prop="version" />-->
      <el-table-column label="当前状态" align="center" prop="currStatCd">
        <template scope="scope">
          {{ scope.row.currStatCd | currStatus }}
        </template>
      </el-table-column>
      <!--      <el-table-column label="当前状态描述" align="center" prop="currStatNm" />-->
      <el-table-column label="服务的活跃级别" align="center" prop="actLevel" />
      <el-table-column label="描述" align="center" prop="sdesc" />
      <el-table-column label="接口类型" align="center" prop="intfType">
        <template scope="scope">
          {{ scope.row.intfType | intfTypes }}
        </template>
      </el-table-column>
      <!--      <el-table-column label="租户ID" align="center" prop="tenantId" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-dropdown slot="scope" size="small">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-edit" @click.native="handleUpdate(scope.row)">
                修改
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-delete" @click.native="handleDelete(scope.row)">
                删除
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-plus" @click.native="addRg(scope.row)">
                新增报文转换规则
              </el-dropdown-item>
              <router-link target="_blank" :to="{path: '/trad', query: { intfPk: scope.row.svcIntfPk}}">
                <el-dropdown-item icon="el-icon-d-arrow-right">
                  交易配置
                </el-dropdown-item>
              </router-link>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <!--        <template slot-scope="scope">-->
        <!--          <el-button-->
        <!--            size="mini"-->
        <!--            type="text"-->
        <!--            icon=""-->
        <!--            @click=""-->
        <!--            v-hasPermi="['system:intf:edit']"-->
        <!--          >修改</el-button>-->
        <!--          <el-button-->
        <!--            size="mini"-->
        <!--            type="text"-->
        <!--            icon="el-icon-delete"-->
        <!--            @click="handleDelete(scope.row)"-->
        <!--            v-hasPermi="['system:intf:remove']"-->
        <!--          >删除</el-button>-->
        <!--          <el-button-->
        <!--            size="mini"-->
        <!--            type="text"-->
        <!--            icon="el-icon-plus"-->
        <!--            @click="handleDelete(scope.row)"-->
        <!--          >新增报文</el-button>-->
        <!--        </template>-->
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改服务接口对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="98px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="版本号" prop="revisionHisPk">
              <el-select v-model="form.revisionHisPk" style="width: 100%" placeholder="请选择修订历史版本">
                <el-option v-for="item in hisList" :key="item.revisionHisPk" :label="item.revisionNbr + '-' + item.markNm" :value="item.revisionHisPk" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务接口ID" label-width="84px" prop="intfId">
              <el-input v-model="form.intfId" placeholder="请输入服务接口ID，六位编号" />
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
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="是否透传"  prop="busiType">-->
          <!--              <el-select v-model="form.busiType" placeholder="请选择是否透传">-->
          <!--                <el-option label="否" value="0" />-->
          <!--                <el-option label="是" value="1" />-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="流程模板" prop="flowTplPk">
              <el-select v-model="form.flowTplPk" style="width: 100%" clearable filterable placeholder="请选择流程模板">
                <el-option v-for="item in flowList" :key="item.flowTplPk" :label="item.tplName" :value="item.flowTplPk" />
              </el-select>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="版本" prop="version">-->
          <!--              <el-input v-model="form.version" placeholder="请输入版本" />-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="当前状态" prop="currStatCd">
              <el-select v-model="form.currStatCd" placeholder="请选择当前状态" clearable @change="selectCurrStat(form.currStatCd)">
                <el-option v-for="item in currStatusSelect" :key="item.currStatCd" :label="item.currStatCd + '-' + item.currStatNm" :value="item.currStatCd" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前状态描述" label-width="110px" prop="currStatNm">
              <el-input v-model="form.currStatNm" disabled placeholder="请输入当前状态描述" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务活跃级别" prop="actLevel">
              <el-select v-model="form.actLevel" placeholder="服务活跃级别" clearable>
                <el-option label="1" value="1" />
                <el-option label="2" value="2" />
                <el-option label="3" value="3" />
                <el-option label="4" value="4" />
                <el-option label="5" value="5" />
                <el-option label="6" value="6" />
                <el-option label="7" value="7" />
                <el-option label="8" value="8" />
                <el-option label="9" value="9" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述" prop="sdesc">
              <el-input v-model="form.sdesc" placeholder="请输入描述" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接口类型" prop="intfType">
              <el-select v-model="form.intfType" style="width: 100%" clearable placeholder="请选择接口类型">
                <el-option label="150-Reqt/Resp" value="150" />
                <el-option label="160-One-Way" value="160" />
                <el-option label="170-Composite" value="170" />
                <el-option label="171-Teller Composite,Need Sequence" value="171" />
                <el-option label="172-Service" value="172" />
                <el-option label="180-Pub/Sub" value="180" />
                <el-option label="190-passThrough" value="190" />
              </el-select>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="租户ID" prop="tenantId">-->
          <!--              <el-input v-model="form.tenantId" placeholder="请输入" />-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-divider content-position="left">报文</el-divider>
    <transf-rg ref="rgRef" />
  </div>
</template>

<script>
import { listIntf, getIntf, delIntf, addIntf, updateIntf, exportIntf } from '@/api/configuration/intf'
import { listHis } from '@/api/configuration/his'
import { getFlowList } from '@/api/flow/flow'
import transfRg from './transfRg'

export default {
  name: 'Intf',
  components: { transfRg },
  filters: {
    busiTypeFil: function(value) {
      if (value === '0') {
        return '否'
      } else if (value === '1') {
        return '是'
      }
    },
    currStatus: function(value) {
      if (value === '150') {
        return '150-候选分析'
      } else if (value === '160') {
        return '160-实现决策'
      } else if (value === '170') {
        return '170-定义报文'
      } else if (value === '180') {
        return '180-发布规范'
      } else if (value === '190') {
        return '190-实施开发'
      } else if (value === '200') {
        return '200-系统联调'
      } else if (value === '210') {
        return '210-部署生产'
      } else if (value === '220') {
        return '220-临时中止'
      } else if (value === '230') {
        return '230-下架退服'
      }
    },
    intfTypes: function(value) {
      if (value === '150') {
        return '150-Reqt/Resp'
      } else if (value === '160') {
        return '160-One-Way'
      } else if (value === '170') {
        return '170-Composite'
      } else if (value === '171') {
        return '171-Teller Composite,Need Sequence'
      } else if (value === '172') {
        return '172-Service'
      } else if (value === '180') {
        return '180-Pub/Sub'
      } else if (value === '190') {
        return '190-passThrough'
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
      // 服务接口表格数据
      intfList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      actLevel: 1,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        revisionHisPk: null,
        intfId: null,
        nameCn: null,
        nameEn: null,
        busiType: null,
        flowTplPk: null,
        version: null,
        currStatCd: null,
        currStatNm: null,
        actLevel: null,
        sdesc: null,
        intfType: null,
        tenantId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        revisionHisPk: [
          { required: true, message: '历史流程不能为空', trigger: 'blur' }
        ],
        nameCn: [
          { required: true, message: '名字不能为空', trigger: 'blur' }
        ],
        intfId: [
          { required: true, message: '接口ID不能为空', trigger: 'blur' }
        ],
        currStatCd: [
          { required: true, message: '当前状态不能为空', trigger: 'blur' }
        ],
        actLevel: [
          { required: true, message: '活跃级别不能为空', trigger: 'blur' }
        ],
        intfType: [
          { required: true, message: '接口类型不能为空', trigger: 'blur' }
        ],
        flowTplPk: [
          { required: true, message: '流程模板不能为空', trigger: 'blur' }
        ]
      },
      // his列表
      hisList: [],
      // 流程模板列表
      flowList: [],
      currStatusSelect: [{
        currStatCd: '150',
        currStatNm: '候选分析'
      }, {
        currStatCd: '160',
        currStatNm: '实现决策'
      }, {
        currStatCd: '170',
        currStatNm: '定义报文'
      }, {
        currStatCd: '180',
        currStatNm: '发布规范'
      }, {
        currStatCd: '190',
        currStatNm: '实施开发'
      }, {
        currStatCd: '200',
        currStatNm: '系统联调'
      }, {
        currStatCd: '210',
        currStatNm: '部署生产'
      }, {
        currStatCd: '220',
        currStatNm: '临时中止'
      }, {
        currStatCd: '230',
        currStatNm: '下架退服'
      }]
    }
  },
  created() {
    this.getList()
    this.getHisList()
    this.listFlow()
  },
  methods: {
    /** 查询服务接口列表 */
    getList() {
      this.loading = true
      listIntf(this.queryParams).then(response => {
        this.intfList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    getHisList() {
      listHis().then(response => {
        this.hisList = response.data.data
      })
    },
    listFlow() {
      getFlowList().then(response => {
        this.flowList = response.data.data
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
        svcIntfPk: null,
        revisionHisPk: null,
        intfId: null,
        nameCn: null,
        nameEn: null,
        busiType: null,
        flowTplPk: null,
        version: null,
        currStatCd: null,
        currStatNm: null,
        actLevel: null,
        sdesc: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
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
      this.ids = selection.map(item => item.svcIntfPk)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.form.actLevel = 1
      this.form.currStatCd = '210'
      this.form.currStatNm = '部署生产'
      this.title = '添加服务接口'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const svcIntfPk = row.svcIntfPk || this.ids
      getIntf(svcIntfPk).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改服务接口'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.svcIntfPk != null) {
            updateIntf(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addIntf(this.form).then(response => {
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
      const svcIntfPks = row.svcIntfPk || this.ids
      this.$confirm('是否确认删除服务接口编号为"' + svcIntfPks + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delIntf(svcIntfPks)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有服务接口数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportIntf(queryParams)
      }).then(response => {
        this.download(response.msg)
      })
    },
    addRg(row) {
      this.$nextTick(() => {
        this.$refs.rgRef.addRg(row)
      })
    },
    // 选中当前行触发
    clickRg(row) {
      const svcId = row.intfId
      this.$refs.rgRef.getRgList(svcId)
    },
    // 新增交易
    addSvcFlow(row) {
      const route = this.$router.resolve({ name: 'Flow', params: row })
      window.open(route.href, '_blank')
    },
    selectCurrStat(currCd) {
      for (const item of this.currStatusSelect) {
        if (currCd === item.currStatCd) {
          this.form.currStatNm = item.currStatNm
        }
      }
    }
  }
}
</script>
