<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="模型名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入模型名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标识Key" prop="key">
        <el-input
          v-model="queryParams.key"
          placeholder="请输入标识Key"
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
          v-hasPermi="['demo:demo:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['demo:demo:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="modelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column fixed align="center" type="index" label="序号" width="50" />
      <el-table-column fixed align="center" prop="name" label="模型名称" />
      <el-table-column align="center" prop="key" label="标识Key" />
      <el-table-column align="center" prop="version" label="版本号" width="90">
        <template slot-scope="{row}"> v{{ row.version }}.0</template>
      </el-table-column>
      <el-table-column align="center" prop="metaInfo" label="备注说明" min-width="130" />
      <el-table-column align="center" prop="createTime" label="创建时间" width="160" />
      <el-table-column align="center" prop="lastUpdateTime" label="更新时间" width="160" />
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="text" size="small" icon="el-icon-thumb" @click="clickDesign(scope.row.id)">设计流程</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="text" size="small" icon="el-icon-download" @click="clickExportZip(scope.row)">导出</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="text" size="small" icon="el-icon-c-scale-to-original" @click="clickDeploy(scope.row.id,scope.row.key)">流程部署</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
            </el-col>
          </el-row>
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
    <!-- 添加模型对话框 -->
    <el-dialog title="新增模型" :visible.sync="open" width="650px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="模型名称：" prop="name">
          <el-input v-model="form.name" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="标识Key：" prop="key">
          <el-input v-model="form.key" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="备注：" prop="description">
          <el-input v-model="form.description" type="textarea" maxlength="30" show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 设计流程 -->
    <design ref="designModel" :model-id="modelId" />
  </div>
</template>

<script>
import { list, add, del, deploy } from '@/api/workflow/model'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import Design from './design'
export default {
  name: 'Model', // 和对应路由表中配置的name值一致
  components: { Design },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
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
      // 是否显示弹出层
      open: false,
      // 模型定义表格数据
      modelList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        key: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '模型名称不能为空', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '标识key不能为空', trigger: 'blur' }
        ]
      },
      modelId: null // 模型id
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateTime = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 分页
    getList() {
      this.loading = true
      list(this.queryParams).then(response => {
        this.modelList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const display = row.id || this.ids
      const ids = this.ids
      let parm = {}
      if (ids.length > 1) {
        parm = {
          ids: ids
        }
      } else {
        parm = {
          ids: [row.id]
        }
      }
      this.$confirm('是否确认删除模型id为"' + display + '"的数据项？').then(() => {
        this.loading = true
        return del(parm)
      }).then(() => {
        this.loading = false
        this.getList()
        this.msgSuccess('删除成功')
      }).finally(() => {
        this.loading = false
      })
    },
    // 流程部署
    clickDeploy(id, key) {
      let parm = {}
      parm = {
        id: id
      }
      this.$confirm('是否部署模型key为【' + key + '】流程？').then(() => {
        this.loading = true
        return deploy(parm)
      }).then(() => {
        this.loading = false
        this.getList()
        this.msgSuccess('部署成功')
      }).finally(() => {
        this.loading = false
      })
    },
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加测试单表'
    },
    // 表单重置
    reset() {
      this.form = {
        name: undefined,
        key: undefined,
        description: undefined
      }
      this.resetForm('form')
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.buttonLoading = true
          add(this.form).then(response => {
            this.msgSuccess('新增成功')
            this.open = false
            this.getList()
          }).finally(() => {
            this.buttonLoading = false
          })
        }
      })
    },
    // 设计流程
    clickDesign(id) {
      this.modelId = id
      this.$refs.designModel.visible = true
    },
    // 导出流程模型
    clickExportZip(data) {
      var baseURL = process.env.VUE_APP_BASE_API
      // this.$download.zip('/workflow/model/export/zip/'+data.id,data.name+"-"+data.key);
      var name = data.name + '-' + data.key
      axios
        .get(baseURL + '/workflow/model/export/zip/' + data.id, {
          headers: { Authorization: getToken() },
          responseType: 'blob'
        })
        .then((res) => {
          const blob = new Blob([res.data]) // 处理文档流
          const fileName = name + '.zip'
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
          this.$message.success('下载成功')
        })
    }
  }

}
</script>
