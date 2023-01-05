<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <!--      <el-form-item label="修订历史" prop="revisionHisPk">-->
      <!--        <el-select style="width: 100%" @change="handleQuery" v-model="queryParams.revisionHisPk" placeholder="请选择修订历史版本">-->
      <!--          <el-option v-for="item in hisList" :key="item.revisionHisPk" :label="item.revisionHisPk + '-版本号:' + item.revisionNbr" :value="item.revisionHisPk"></el-option>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="组件名称-英文" label-width="120px" prop="beanName">
        <el-input
          v-model="queryParams.beanName"
          placeholder="请输入组件名称-英文"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="描述-中文" label-width="80px" prop="sdesc">
        <el-input
          v-model="queryParams.sdesc"
          placeholder="请输入描述-中文"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组件类型" label-width="100px" prop="cmpTypeCd">
        <el-select
          v-model="queryParams.cmpTypeCd"
          style="width: 100%"
          clearable
          placeholder="请选择组件类型"
          @change="handleQuery"
        >
          <el-option
            v-for="item in cmpTypeList"
            :key="item.cmpTypeCd"
            :label="item.cmpTypeCd + '-' + item.cmpTypeNm"
            :value="item.cmpTypeCd"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="租户ID" prop="tenantId">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.tenantId"-->
      <!--          placeholder="请输入租户ID—项目组件"-->
      <!--          clearable-->
      <!--          size="small"-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
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
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="danger"-->
      <!--          icon="el-icon-delete"-->
      <!--          size="mini"-->
      <!--          :disabled="multiple"-->
      <!--          @click="handleDelete"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table
      v-loading="loading"
      highlight-current-row
      :data="cmpDefList"
      @row-click="clickCmp"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="cmpPk" />
      <el-table-column label="修订历史" align="center" prop="revisionHisPk" />
      <el-table-column label="组件名称-英文" align="center" prop="beanName" />
      <el-table-column label="描述-中文" align="center" prop="sdesc" />
      <el-table-column label="组件类型(代码-名称)" align="center" prop="cmpTypeCd">
        <template scope="scope">
          {{ scope.row.cmpTypeCd + '-' + scope.row.cmpTypeNm }}
        </template>
      </el-table-column>
      <el-table-column label="流程pk(子流程组件相关联的子流程)" align="center" prop="subFlowTplPk" />
      <el-table-column label="租户ID" align="center" prop="tenantId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['system:cmpDef:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-hasPermi="['system:cmpDef:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
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

    <!-- 添加或修改组件定义对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="115px">
        <el-form-item label="修订历史" prop="revisionHisPk">
          <el-select v-model="form.revisionHisPk" style="width: 100%" placeholder="请选择修订历史版本">
            <el-option
              v-for="item in hisList"
              :key="item.revisionHisPk"
              :label="item.revisionNbr + '-' + item.markNm"
              :value="item.revisionHisPk"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="组件名称-英文" prop="beanName">
          <el-input v-model="form.beanName" placeholder="请输入组件名称-英文" />
        </el-form-item>
        <el-form-item label="描述-中文" prop="sdesc">
          <el-input v-model="form.sdesc" placeholder="请输入描述-中文" />
        </el-form-item>
        <el-form-item label="组件类型" prop="cmpTypeCd">
          <el-select
            v-model="form.cmpTypeCd"
            style="width: 100%"
            placeholder="请选择组件类型"
            @change="typeSelect(form.cmpTypeCd)"
          >
            <el-option
              v-for="item in cmpTypeList"
              :key="item.cmpTypeCd"
              :label="item.cmpTypeCd + '-' + item.cmpTypeNm"
              :value="item.cmpTypeCd"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="false" label="组件类型名称" prop="cmpTypeNm">
          <el-input v-model="form.cmpTypeNm" disabled />
        </el-form-item>
        <el-form-item v-if="form.cmpTypeCd === '190'" label="子流程" prop="subFlowTplPk">
          <el-select v-model="form.subFlowTplPk" style="width: 100%" placeholder="请选择子流程">
            <el-option
              v-for="item in subFlowList"
              :key="item.flowTplPk"
              :label="item.flowTplPk + '-' + item.tplName"
              :value="item.flowTplPk"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="租户ID" prop="tenantId">
          <el-input v-model="form.tenantId" placeholder="请输入租户ID—项目组件，公共组件为(000)" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-divider content-position="left">组件参数配置</el-divider>
    <pram-config ref="pram" />
  </div>
</template>

<script>
import { listCmpDef, getCmpDef, delCmpDef, addCmpDef, updateCmpDef, exportCmpDef } from '@/api/configuration/cmpDef'
import { listHis } from '@/api/configuration/his'
import { listCmpType } from '@/api/configuration/cmpType'
import { getFlowList } from '@/api/flow/flow'
import PramConfig from './pramConfig'

export default {
  name: 'CmpDef',
  components: { PramConfig },
  filters: {},
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
      // 组件定义表格数据
      cmpDefList: [],
      // 弹出层标题
      title: '',
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
        tenantId: null
      },
      // 表单参数
      form: {},
      // his列表
      hisList: [],
      // 组件类型列表
      cmpTypeList: [],
      // 表单校验
      rules: {
        revisionHisPk: [
          { required: true, message: '修订历史不能为空', trigger: 'blur' }
        ],
        beanName: [
          { required: true, message: '组件名称不能为空', trigger: 'blur' }
        ],
        sdesc: [
          { required: true, message: '组件描述不能为空', trigger: 'blur' }
        ],
        cmpTypeCd: [
          { required: true, message: '组件类型不能为空', trigger: 'blur' }
        ],
        subFlowTplPk: [
          { required: true, message: '子流程不能为空', trigger: 'blur' }
        ]
      },
      // 子流程列表
      subFlowList: []
    }
  },
  created() {
    this.getList()
    this.getHisList()
    this.getCmpTypeList()
    this.getSubFlowList()
  },
  methods: {
    /** 查询组件定义列表 */
    getList() {
      this.loading = true
      listCmpDef(this.queryParams).then(response => {
        this.cmpDefList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 获取版本号列表
    getHisList() {
      listHis().then(response => {
        this.hisList = response.data.data
      })
    },
    // 获取组件类型列表
    getCmpTypeList() {
      listCmpType().then(response => {
        this.cmpTypeList = response.data.data
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
        cmpPk: null,
        revisionHisPk: null,
        beanName: null,
        sdesc: null,
        cmpTypeCd: null,
        cmpTypeNm: null,
        subFlowTplPk: null,
        tenantId: null,
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
      this.ids = selection.map(item => item.cmpPk)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加组件定义'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const cmpPk = row.cmpPk || this.ids
      getCmpDef(cmpPk).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改组件定义'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.cmpPk != null) {
            updateCmpDef(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addCmpDef(this.form).then(response => {
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
      const cmpPks = row.cmpPk || this.ids
      this.$confirm('是否确认删除组件定义编号为"' + cmpPks + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delCmpDef(cmpPks)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有组件定义数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportCmpDef(queryParams)
      }).then(response => {
        this.download(response.msg)
      })
    },
    clickCmp(row, event, column) {
      const currentCmpPk = row.cmpPk
      const currenthis = row.revisionHisPk
      const params = { 'cmpPk': currentCmpPk, 'revisionHisPk': currenthis }
      this.$refs.pram.getList(params)
    },
    typeSelect(cmpTypeCd) {
      let item
      for (item of this.cmpTypeList) {
        if (cmpTypeCd === item.cmpTypeCd) {
          this.form.cmpTypeNm = item.cmpTypeNm
        }
      }
    },
    getSubFlowList() {
      const subFlowParams = { tplType: '03' }
      getFlowList(subFlowParams).then(response => {
        this.subFlowList = response.data.data
      })
    }
  }
}
</script>
