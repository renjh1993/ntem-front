<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="协议Id" prop="bndProflId">
        <el-input
          v-model="queryParams.bndProflId"
          placeholder="请输入协议概要Id"
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
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
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" border :data="proflList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="bndProflPk" />
      <el-table-column label="修订历史" align="center" prop="revisionHisPk">
        <template scope="scope">
          {{ scope.row.revisionHisPk | revisionHis(hisList) }}
        </template>
      </el-table-column>
      <el-table-column label="协议概要Id" align="center" prop="bndProflId" />
      <el-table-column label="描述" align="center" prop="sdesc" />
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

    <!-- 添加或修改ESB访问服务提供方的协议概要对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="版本号" prop="revisionHisPk">
          <el-select v-model="form.revisionHisPk" style="width: 100%" placeholder="请选择修订历史版本">
            <el-option v-for="item in hisList" :key="item.revisionHisPk" :label="item.revisionNbr + '-' + item.markNm" :value="item.revisionHisPk" />
          </el-select>
        </el-form-item>
        <el-form-item label="协议概要Id" prop="bndProflId">
          <el-input v-model="form.bndProflId" placeholder="请输入协议概要Id" />
        </el-form-item>
        <el-form-item label="中文名" prop="nameCn">
          <el-input v-model="form.nameCn" placeholder="请输入中文名" />
        </el-form-item>
        <el-form-item label="英文名" prop="nameEn">
          <el-input v-model="form.nameEn" placeholder="请输入英文名" />
        </el-form-item>
        <el-form-item label="描述" prop="sdesc">
          <el-input v-model="form.sdesc" placeholder="请输入描述" />
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
import { listProfl, getProfl, delProfl, addProfl, updateProfl, exportProfl } from '@/api/configuration/profl'
import { listHis } from '@/api/configuration/his'

export default {
  name: 'Profl',
  filters: {
    revisionHis: function(value, hisList) {
      let revisionHis
      hisList.map(res => {
        if (value === res.revisionHisPk) {
          revisionHis = res.revisionNbr + '-' + res.markNm
        }
      })
      return revisionHis
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
      // ESB访问服务提供方的协议概要表格数据
      proflList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        revisionHisPk: null,
        bndProflId: null,
        nameCn: null,
        nameEn: null,
        sdesc: null,
        bndTypeCd: null,
        bndTypeNm: null,
        dpQmName: null,
        dpReqtqName: null,
        dpReplyqName: null,
        dpRetryqName: null
      },
      // his列表
      hisList: [],
      // 表单参数
      form: {},
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
  },
  methods: {
    /** 查询ESB访问服务提供方的协议概要列表 */
    getList() {
      this.loading = true
      listProfl(this.queryParams).then(response => {
        this.proflList = response.data.data
        this.total = response.data.total
        this.loading = false
      })
    },
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
        bndProflPk: null,
        revisionHisPk: null,
        bndProflId: null,
        nameCn: null,
        nameEn: null,
        sdesc: null,
        bndTypeCd: null,
        bndTypeNm: null,
        dpQmName: null,
        dpReqtqName: null,
        dpReplyqName: null,
        dpRetryqName: null,
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
      this.ids = selection.map(item => item.bndProflPk)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加ESB访问服务提供方的协议概要'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const bndProflPk = row.bndProflPk || this.ids
      getProfl(bndProflPk).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改ESB访问服务提供方的协议概要'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.bndProflPk != null) {
            updateProfl(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addProfl(this.form).then(response => {
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
      this.$confirm('是否确认删除ESB访问服务提供方的协议概要编号为"' + bndProflPks + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delProfl(bndProflPks)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有ESB访问服务提供方的协议概要数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportProfl(queryParams)
      }).then(response => {
        this.download(response.message)
      })
    }
  }
}
</script>
