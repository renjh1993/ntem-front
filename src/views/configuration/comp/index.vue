<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="版本号" prop="revisionHisPk">
        <el-select v-model="queryParams.revisionHisPk" style="width: 100%" placeholder="请选择修订历史版本">
          <el-option v-for="item in hisList" :key="item.revisionHisPk" :label="item.revisionHisPk + '-版本号:' + item.revisionNbr" :value="item.revisionHisPk" />
        </el-select>
      </el-form-item>
      <el-form-item label="系统号(仅查询)" label-width="120px" prop="compId">
        <el-input
          v-model="queryParams.compId"
          placeholder="请输入组件Id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="nameCn">
        <el-input
          v-model="queryParams.nameCn"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="缩写" prop="nameEn">
        <el-input
          v-model="queryParams.nameEn"
          placeholder="请输入缩写"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组件类型" prop="compTypeCd">
        <el-select v-model="queryParams.compTypeCd" style="width: 100%" placeholder="请选择组件类型">
          <el-option v-for="dict in compType" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
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
          v-hasPermi="['system:comp:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:comp:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:comp:remove']"
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
      <!--          v-hasPermi="['system:comp:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" border :data="compList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="系统ID" align="center" prop="compId" />
      <el-table-column label="版本号" align="center" prop="revisionHisPk" />
      <el-table-column label="中文名" align="center" prop="nameCn" />
      <el-table-column label="英文缩写" align="center" prop="nameEn" />
      <el-table-column label="描述" align="center" prop="sdesc" />
      <el-table-column label="系统类型" align="center" prop="compType">
        <template scope="scope">
          {{ scope.row.compTypeCd + "-" + scope.row.compTypeNm }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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

    <!-- 添加或修改组件定义对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="版本号" prop="revisionHisPk">
              <el-select v-model="form.revisionHisPk" style="width: 100%" placeholder="请选择修订历史版本">
                <el-option v-for="item in hisList" :key="item.revisionHisPk" :label="item.revisionNbr + '-' + item.markNm" :value="item.revisionHisPk" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统Id" prop="compId">
              <el-input v-model="form.compId" placeholder="请输入系统Id" />
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
            <el-form-item label="系统别名" prop="compAlias">
              <el-input v-model="form.compAlias" placeholder="请输入系统别名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述" prop="sdesc">
              <el-input v-model="form.sdesc" placeholder="请输入描述" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统类型" label-width="100px" prop="compTypeCd">
              <el-select v-model="form.compTypeCd" style="width: 100%" placeholder="请选择系统类型" @change="typeSelect(form.compTypeCd)">
                <el-option v-for="dict in compType" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-show="false" label="系统类型名称" prop="compTypeNm">
              <el-input v-model="form.compTypeNm" placeholder="请输入系统类型名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ipAddr" prop="ipAddr">
              <el-input v-model="form.ipAddr" placeholder="请输入ipAddr" />
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
import { listComp, getComp, delComp, addComp, updateComp, exportComp } from '@/api/configuration/comp'
import { listHis } from '@/api/configuration/his'

export default {
  name: 'Comp',
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
      compList: [],
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
        nameCn: null,
        nameEn: null,
        compAlias: null,
        sdesc: null,
        compTypeCd: null,
        compTypeNm: null,
        ipAddr: null
      },
      // his列表
      hisList: [],
      // 系统类型
      compType: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        revisionHisPk: [
          { required: true, message: '修订历史不能为空', trigger: 'blur' }
        ]
      },
      compTypeList: [{
        compTypeCd: '150',
        compTypeNm: '系统'
      }]
    }
  },
  created() {
    this.getList()
    this.getHisList()
    this.getDicts('comp_type').then(response => {
      this.compType = response.data
    })
  },
  methods: {
    /** 查询组件定义列表 */
    getList() {
      this.loading = true
      listComp(this.queryParams).then(response => {
        this.compList = response.data.data
        this.total = response.data.total
        this.loading = false
      })
    },
    // 获取版本号列表
    getHisList() {
      listHis().then(response => {
        this.hisList = response.data.data
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
        compPk: null,
        revisionHisPk: null,
        compId: null,
        nameCn: null,
        nameEn: null,
        compAlias: null,
        sdesc: null,
        compTypeCd: null,
        compTypeNm: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        ipAddr: null
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
      this.ids = selection.map(item => item.compPk)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加系统'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const compPk = row.compPk || this.ids
      getComp(compPk).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改系统'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.compPk != null) {
            updateComp(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addComp(this.form).then(response => {
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
      const compPks = row.compPk || this.ids
      this.$confirm('是否确认删除组件定义编号为"' + compPks + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delComp(compPks)
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
        return exportComp(queryParams)
      }).then(response => {
        this.download(response.msg)
      })
    },
    typeSelect(compTypeCd) {
      if (compTypeCd === '150') {
        this.form.compTypeNm = '系统'
      } else if (compTypeCd === '170') {
        this.form.compTypeNm = '模块'
      }
    }
  }
}
</script>
