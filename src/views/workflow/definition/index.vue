<template>
  <div class="app-container">
    <!-- 检索 -->
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
      <el-button icon="el-icon-upload" size="small" type="primary" @click="clickDeploy">部署流程文件</el-button>
      <el-alert style="margin:10px 0" title="说明：当有多个相同标识Key的流程时，只显示其最新版本流程。" type="info" show-icon :closable="false" />
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>
    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column fixed align="center" type="index" label="序号" width="50" />
      <el-table-column fixed align="center" prop="name" label="模型名称" min-width="160" />
      <el-table-column align="center" prop="key" label="标识Key" min-width="120" />
      <el-table-column align="center" prop="version" label="版本号" width="90">
        <template slot-scope="{row}"> v{{ row.version }}.0</template>
      </el-table-column>
      <el-table-column align="center" prop="resourceName" label="流程XML" min-width="150">
        <template slot-scope="{row}">
          <!-- 注意组件上使用原生事件，要加 .active -->
          <el-link type="primary" @click.native="clickExportXML(row.id)">{{ row.resourceName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="diagramResourceName" label="流程图片" min-width="150">
        <template slot-scope="{row}">
          <el-link type="primary" @click="clickPreviewImg(row.id)">{{ row.diagramResourceName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="suspensionState" label="状态" min-width="50">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.suspensionState==1" type="success">激活</el-tag>
          <el-tag v-else type="danger">挂起</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="businessRoute" label="关联业务路由名" min-width="130" />
      <el-table-column align="center" prop="formName" label="关联表单组件名" min-width="130" />
      <el-table-column align="center" prop="deploymentTime" label="部署时间" width="150" />
      <el-table-column label="操作" align="center" width="185" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-sort"
                @click="convertToModel
                  (scope.row)"
              >转换模型</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-if="scope.row.suspensionState == 1"
                type="text"
                size="mini"
                icon="el-icon-lock"
                @click="clickUpdateProcDefState(scope.row)"
              >挂起</el-button>
              <el-button
                v-else
                type="text"
                size="mini"
                icon="el-icon-unlock"
                @click="clickUpdateProcDefState(scope.row)"
              >激活</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-dropdown class="el-dropdown-link-position">
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button size="mini" type="text" icon="el-icon-setting" @click="handleSetting(scope.row)">审批人员设置</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button size="mini" type="text" icon="el-icon-setting" @click="handleConfig(scope.row.key)">流程配置</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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

    <!-- 部署流程文件 -->
    <process-deploy ref="deployProcess" />

    <!-- 预览图片 -->
    <process-preview ref="previewRef" :url="url" />

    <!-- 审批人员设置 -->
    <process-setting ref="settingRef" />
    <!-- 流程配置 -->
    <process-config ref="configRef" :process-key="propKey" />

  </div>
</template>
<script>
import { list, del, updateProcDefState } from '@/api/workflow/definition'
import { convertToModel } from '@/api/workflow/model'
import processDeploy from './components/processDeploy'
import processPreview from './components/processPreview'
// import processHisList from './components/processHisList'
import processSetting from './components/processSetting'
import ProcessConfig from './components/Config'

export default {
  name: 'Definition', // 和对应路由表中配置的name值一致
  // components: { processDeploy, processPreview,processHisList,processSetting },
  components: { processDeploy, processPreview, processSetting, ProcessConfig },
  data() {
    return {
      // 流程图
      url: null,
      // 流程key
      propKey: null,
      // 流程定义id
      definitionId: null,
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
      // 表格数据
      dataList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        key: undefined
      },
      settingVisible: false

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
    // 将流程定义转换为模型
    convertToModel(row) {
      this.$confirm('是否转换模型？').then(() => {
        this.loading = true
        return convertToModel(row.id)
      }).then(() => {
        this.loading = false
        this.getList()
        this.msgSuccess('转换成功')
      }).finally(() => {
        this.loading = false
      })
    },
    // 分页
    getList() {
      this.loading = true
      list(this.queryParams).then(response => {
        this.dataList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let parm = {}
      const deploymentId = row.deploymentId
      parm = {
        deploymentId: deploymentId,
        definitionId: row.id,
        definitionKey: row.key
      }
      this.$confirm('是否确认删除标识key为"' + row.key + '"的数据项？').then(() => {
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
    // 弹出部署流程文件窗口
    clickDeploy() {
      this.$refs.deployProcess.visible = true
    },
    // 导出xml流程文件
    clickExportXML(id) {
      this.msgSuccess('导出xml流程文件成功')
      window.open(process.env.VUE_APP_BASE_API + '/workflow/definition/export/xml/' + id)
    },

    // 预览图片 downFile
    clickPreviewImg(id) {
      this.url = process.env.VUE_APP_BASE_API + '/workflow/definition/export/png/' + id
      this.$refs.previewRef.visible = true
    },
    // 激活或挂起流程
    clickUpdateProcDefState(row) {
      let msg = ''
      if (row.suspensionState === 1) {
        msg = `暂停后，此流程下的所有任务都不允许往后流转，您确定挂起【${row.name || row.key}】吗？`
      } else {
        msg = `启动后，此流程下的所有任务都允许往后流转，您确定激活【${row.name || row.key}】吗？`
      }
      this.$confirm(msg).then(() => {
        this.loading = true
        return updateProcDefState(row.id)
      }).then(() => {
        this.loading = false
        this.getList()
        this.msgSuccess('操作成功')
      }).finally(() => {
        this.loading = false
      })
    },

    // 打开审批人员设置
    handleSetting(row) {
      this.$nextTick(() => {
        this.$refs.settingRef.visible = true
        this.$refs.settingRef.init(row.id)
      })
    },
    // 打开流程配置
    handleConfig(key) {
      this.propKey = key
      this.$refs.configRef.visible = true
    }
  }
}
</script>
<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    font-size: 12px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-dropdown-link-position{
    padding-top: 3px;
  }
</style>

