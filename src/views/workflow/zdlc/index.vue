<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
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
          v-hasPermi="['zdlc:workflowZdlc:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['zdlc:workflowZdlc:del']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          v-hasPermi="['zdlc:workflowZdlc:export']"
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table ref="multipleTable" v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="ID" align="center" prop="id"/> -->
      <!-- <el-table-column label="借款企业情况" align="center" prop="jkqyqk" />
            <el-table-column label="转贷申请表" align="center" prop="zdsqb" />
            <el-table-column label="基础资料扫描原件" align="center" prop="jczlsmyj" />
            <el-table-column label="借款人背景资料" align="center" prop="jkrbjzl" />
            <el-table-column label="其他资料" align="center" prop="qtzl" /> -->
      <el-table-column label="创建人" align="center" prop="crtuser" />
      <el-table-column label="创建时间" align="center" prop="crtdate" />
      <el-table-column label="更新人" align="center" prop="upduser" />
      <el-table-column label="更新时间" align="center" prop="upddate" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <div>
            {{ statusFormat(scope.row) }}
          </div>

        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="'1' === scope.row.status || '3' === scope.row.status"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >查看/修改
          </el-button>
          <el-button
            v-if="'1' === scope.row.status"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleSub(scope.row)"
          >提交
          </el-button>
          <el-button
            v-if="'1' === scope.row.status || '5' === scope.row.status || '4' === scope.row.status || '7' === scope.row.status"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
          <el-button
            v-if="'7' === scope.row.status"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >重新提交
          </el-button>

          <el-button
            v-if="'1' !== scope.row.status"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="historyFory(scope.row)"
          >审批详情
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 新增弹出框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-tag>请以pdf格式上传附件</el-tag>
      <el-form ref="form" :model="form" :rules="rules" :is-drfat="isDraft" label-width="140px">
        <el-form-item label="借款企业情况" prop="fileList1">
          <el-upload
            ref="upload1"
            :file-list="fileList1"
            action=""
            accept=".pdf"
            :on-remove="(file, fileList) => { handleRemove(file, fileList, 1) }"
            :on-change="(file, fileList) => { handleChange(file, fileList, 1) }"
            multiple
            :on-preview="handlePreview"
            :with-credentials="true"
            :on-exceed="handleExceed"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传借款企业情况</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="转贷申请表" prop="fileList2">
          <el-upload
            :file-list="fileList2"
            action=""
            accept=".pdf"
            :before-upload="beforeUpload"
            :on-remove="(file, fileList) => { handleRemove(file, fileList, 2) }"
            :on-change="(file, fileList) => { handleChange(file, fileList, 2) }"
            multiple
            :on-preview="handlePreview"
            :with-credentials="true"
            :on-exceed="handleExceed"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传转贷申请表</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="基础资料扫描原件" prop="fileList3">
          <el-upload
            :file-list="fileList3"
            accept=".pdf"
            :before-upload="beforeUpload"
            :on-remove="(file, fileList) => { handleRemove(file, fileList, 3) }"
            action=""
            :on-change="(file, fileList) => { handleChange(file, fileList, 3) }"
            multiple
            :on-preview="handlePreview"
            :with-credentials="true"
            :on-exceed="handleExceed"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传基础资料扫描原件</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="借款人背景资料" prop="fileList4">
          <el-upload
            :file-list="fileList4"
            accept=".pdf"
            :before-upload="beforeUpload"
            :on-remove="(file, fileList) => { handleRemove(file, fileList, 4) }"
            action=""
            :on-change="(file, fileList) => { handleChange(file, fileList, 4) }"
            multiple
            :on-preview="handlePreview"
            :with-credentials="true"
            :on-exceed="handleExceed"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传借款人背景资料</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="其他资料" prop="fileList5">
          <el-upload
            :file-list="fileList5"
            accept=".pdf"
            :before-upload="beforeUpload"
            :on-remove="(file, fileList) => { handleRemove(file, fileList, 5) }"
            action=""
            :on-change="(file, fileList) => { handleChange(file, fileList, 5) }"
            multiple
            :on-preview="handlePreview"
            :with-credentials="true"
            :on-exceed="handleExceed"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传其他资料</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="true === isDraft" @click="asDraft">暂 存</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <approvalForm ref="approvalForm" :business-key="businessKey" :process-instance-id="instanceId" />
  </div>
</template>

<script>
import api from '@/api/workflow/workflowZdlc'
import approvalForm from '@/views/components/approvalForm'

export default {
  name: 'WorkflowZdlc',
  components: {
    approvalForm
  },
  data() {
    var validate1 = (rule, value, callback) => {
      if (this.valid1) {
        callback()
      } else {
        callback(new Error('附件不能为空'))
      }
    }
    var validate2 = (rule, value, callback) => {
      if (this.valid2) {
        callback()
      } else {
        callback(new Error('附件不能为空'))
      }
    }
    var validate3 = (rule, value, callback) => {
      if (this.valid3) {
        callback()
      } else {
        callback(new Error('附件不能为空'))
      }
    }
    var validate4 = (rule, value, callback) => {
      if (this.valid4) {
        callback()
      } else {
        callback(new Error('附件不能为空'))
      }
    }
    var validate5 = (rule, value, callback) => {
      if (this.valid5) {
        callback()
      } else {
        callback(new Error('附件不能为空'))
      }
    }
    return {
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      fileList5: [],
      valid1: false,
      valid2: false,
      valid3: false,
      valid4: false,
      valid5: false,
      updateId: null,
      isUpdate: false,
      modelVisible: false,
      modelerUrl: '',
      userName: '',
      createName: '',
      businessKey: '',
      instanceId: null,
      // 是否显示暂存按钮
      isDraft: false,
      visible: false,
      // 用户信息
      user: {},
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
      // 表格数据
      tableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      openDetails: false,
      openUpdate: false,
      openRe: false,
      openEdit: false,
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        pzsqb: null,
        zdsqb: null,
        jczlsmyj: null,
        jkrbjzl: null,
        qtzl: null,
        crtuser: null,
        crtdate: null,
        upduser: null,
        upddate: null,
        status: null
      },
      // 表单参数
      form: {
        id: null
      },
      // 更新 表单参数
      updateForm: {},
      // 提交修改 表单参数
      editForm: {},
      // 重新提交 表单参数
      reForm: {},
      // 表单校验 下拉框、日期框时trigger: 'change',值发生改变时校验，输入框trigger: 'blur',失去焦点时校验
      rules: {
        fileList1: [
          { required: true, validator: validate1, message: '附件不能为空' }
        ],
        fileList2: [
          { required: true, validator: validate2, message: '附件不能为空' }
        ],
        fileList3: [
          { validator: validate3, required: true, message: '附件不能为空' }
        ],
        fileList4: [
          { validator: validate4, required: true, message: '附件不能为空' }
        ],
        fileList5: [
          { validator: validate5, required: true, message: '附件不能为空' }
        ]

      }
    }
  },
  created() {
    console.log(this.$store.getters)
    this.getList()
    this.getDicts('activiti_flow_type').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    // 根据url生成文件
    getFileFromUrl(fileName, url) {
      return new Promise((resolve, reject) => {
        var blob = null
        let file
        var xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.setRequestHeader('Accept', 'application/pdf')
        xhr.responseType = 'blob'
        // 加载时处理
        xhr.onload = () => {
          // 获取返回结果
          blob = xhr.response
          file = new File([blob], fileName, { type: 'application/pdf' })
          // window.open(URL.createObjectURL(file))
          // 返回结果
          resolve(file)
        }
        xhr.send()
      })
    },

    beforeUpload(file, fileList, index) {
      console.log(fileList, index)
      const isPDF = file.name.substring(file.name.lastIndexOf('.'), file.name.length) === ('.pdf' || '.PDF')
      // const isLt2M = file.size / 1024 / 1024 < 2;
      console.log(file.name.substring(file.name.lastIndexOf('.'), file.name.length))
      if (!isPDF) {
        this.$message.error('上传附件只能是 PDF 格式!')
        fileList.pop()
      }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      return isPDF
    },
    handlePreview(file) {
      window.open(URL.createObjectURL(file.raw))
    },
    handleRemove(file, fileList, index) {
      console.log(file.raw)
      if (index === 1) {
        this.valid1 = false
        this.fileList1 = fileList
        if (this.fileList1.length > 0) {
          this.valid1 = true
        }
      } else if (index === 2) {
        this.valid2 = false
        this.fileList2 = fileList
        if (this.fileList2.length > 0) {
          this.valid2 = true
        }
      } else if (index === 3) {
        this.valid3 = false
        this.fileList3 = fileList
        if (this.fileList3.length > 0) {
          this.valid3 = true
        }
      } else if (index === 4) {
        this.valid4 = false
        this.fileList4 = fileList
        if (this.fileList4.length > 0) {
          this.valid4 = true
        }
      } else {
        this.valid5 = false
        this.fileList5 = fileList
        if (this.fileList5.length > 0) {
          this.valid5 = true
        }
      }
    },
    handleChange(file, fileList, index) {
      var isPDF = this.beforeUpload(file, fileList, index)
      console.log(fileList)
      if (isPDF) {
        if (index === 1) {
          this.valid1 = false
          this.fileList1 = fileList
          if (this.fileList1.length > 0) {
            this.valid1 = true
          }
        } else if (index === 2) {
          this.valid2 = false
          this.fileList2 = fileList
          if (this.fileList2.length > 0) {
            this.valid2 = true
          }
        } else if (index === 3) {
          this.valid3 = false
          this.fileList3 = fileList
          if (this.fileList3.length > 0) {
            this.valid3 = true
          }
        } else if (index === 4) {
          this.valid4 = false
          this.fileList4 = fileList
          if (this.fileList4.length > 0) {
            this.valid4 = true
          }
        } else {
          this.valid5 = false
          this.fileList5 = fileList
          if (this.fileList5.length > 0) {
            this.valid5 = true
          }
        }
      } else {
        return
      }
      console.log(fileList)
    },

    // 上传文件超出个数
    handleExceed(__file, __fileList) {
      this.$message.warning(`当前只能选择上传2 个证书`)
    },
    /** 查询列表 */
    getList() {
      console.log(this.queryParams)
      this.loading = true
      api.query(this.queryParams).then(response => {
        this.tableList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 状态字典翻译
    statusFormat(row, __column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    cancelUpdate() {
      this.openUpdate = false
      this.reset()
    },
    cancelRe() {
      this.openRe = false
      this.reset()
    },
    cancelEdit() {
      this.openEdit = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        jkqyqk: null,
        zdsqb: null,
        jczlsmyj: null,
        jkrbjzl: null,
        qtzl: null,
        crtuser: null,
        crtdate: null,
        upduser: null,
        upddate: null,
        status: null
      }
      this.fileList1 = []
      this.fileList2 = []
      this.fileList3 = []
      this.fileList4 = []
      this.fileList5 = []
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
      let warn = false// 当选中的数据中有待审批和处理中的流程时会弹出“待审批和进行中的流程无法被删除”的警告
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].status === '2' || selection[i].status === '3') {
          // this.$refs.multipleTable.toggleRowSelection(row,false);
          warn = true
          // 移除待审批和处理中数据
          selection.splice(i, 1)
          i--
        }
      }
      this.ids = selection.map(row => row.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      if (warn) {
        this.$message.warning('待审批和进行中的流程无法被删除')
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.resetValid()
      this.createName = this.$store.getters.nickName
      if (this.$store.getters.name !== 'admin') {
        this.reset()
        this.isDraft = true
        this.open = true
        this.title = '添加附件'
      } else {
        this.$alert('管理员不能创建流程', '管理员不能创建流程', {
          confirmButtonText: '确定'
        })
      }
    },
    resetValid() {
      this.valid1 = false
      this.valid2 = false
      this.valid3 = false
      this.valid4 = false
      this.valid5 = false
    },
    /** 更新按钮操作 */
    handleUpdate(row) {
      if (row.id != null) {
        this.updateId = row.id
      }
      console.log(this.updateId)
      this.reset()
      api.getOne({ id: this.updateId }).then(response => {
        if (response.data.jkqyqk) {
          this.valid1 = true
          this.fileList(this.fileList1, response.data.jkqyqk.split(','))
        }
        if (response.data.zdsqb) {
          this.valid2 = true
          this.fileList(this.fileList2, response.data.zdsqb.split(','))
        }
        if (response.data.jczlsmyj) {
          this.valid3 = true
          this.fileList(this.fileList3, response.data.jczlsmyj.split(','))
        }
        if (response.data.jkrbjzl) {
          this.valid4 = true
          this.fileList(this.fileList4, response.data.jkrbjzl.split(','))
        }
        if (response.data.qtzl) {
          this.valid5 = true
          this.fileList(this.fileList5, response.data.qtzl.split(','))
        }
        this.isUpdate = true
        this.isDraft = false
        this.open = true
        this.title = '更新'
      })
    },

    /** 审批详情 */
    historyFory(row) {
      this.instanceId = row.instanceId
      this.businessKey = row.id
      this.$refs.approvalForm.visible = true
    },

    handleSub(row) {
      this.$myloading.show('提交中')
      row.businessRoute = this.$route.name
      api.addByDraft(row).then(__response => {
        this.$myloading.hide()
        this.msgSuccess('提交成功')
        this.getList()
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        let formData
        if (valid) {
          this.form.id = this.updateId
          this.$myloading.show('提交中')
          if (this.form.id != null && !this.isUpdate) {
            formData = new FormData() // 用FormData存放上传文件
            this.fileList1.forEach(file => {
              console.log('我是jkqyqk', file)
              // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
              formData.append('jkqyqk', file.raw, file.raw.name)
            })
            this.fileList2.forEach(file => {
              console.log('我是zdsqb', file)
              // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
              formData.append('zdsqb', file.raw, file.raw.name)
            })
            this.fileList3.forEach(file => {
              console.log('我是jczlsmyj', file)
              // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
              formData.append('jczlsmyj', file.raw, file.raw.name)
            })
            this.fileList4.forEach(file => {
              console.log('我是jkrbjzl', file)
              // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
              formData.append('jkrbjzl', file.raw, file.raw.name)
            })
            this.fileList5.forEach(file => {
              console.log('我是qtzl', file)
              // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
              formData.append('qtzl', file.raw, file.raw.name)
            })
            formData.append('id', this.form.id)
            api.update(formData).then(__response => {
              this.$myloading.hide()
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
              this.reset()
            })
          } else {
            this.isUpdate = false
            this.form.businessRoute = this.$route.name
            formData = new FormData() // 用FormData存放上传文件
            this.fileList1.forEach(file => {
              console.log('我是jkqyqk', file)
              // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
              formData.append('jkqyqk', file.raw, file.raw.name)
            })
            this.fileList2.forEach(file => {
              console.log('我是zdsqb', file)
              // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
              formData.append('zdsqb', file.raw, file.raw.name)
            })
            this.fileList3.forEach(file => {
              console.log('我是jczlsmyj', file)
              // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
              formData.append('jczlsmyj', file.raw, file.raw.name)
            })
            this.fileList4.forEach(file => {
              console.log('我是jkrbjzl', file)
              // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
              formData.append('jkrbjzl', file.raw, file.raw.name)
            })
            this.fileList5.forEach(file => {
              console.log('我是qtzl', file)
              // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
              formData.append('qtzl', file.raw, file.raw.name)
            })
            formData.append('id', this.form.id)

            formData.append('businessRoute', this.$route.name)
            console.log(formData)
            api.add(formData).then(__response => {
              this.$myloading.hide()
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
              this.reset()
            })
          }
        }
      })
    },

    /** 暂存按钮 */
    asDraft() {
      this.$refs['form'].validate(valid => {
        console.log(valid)
        if (valid) {
          this.$myloading.show('提交中')
          this.loading = true
          var formData = new FormData() // 用FormData存放上传文件
          this.fileList1.forEach(file => {
            console.log('我是jkqyqk', file)
            // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
            formData.append('jkqyqk', file.raw, file.raw.name)
          })
          this.fileList2.forEach(file => {
            console.log('我是zdsqb', file)
            // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
            formData.append('zdsqb', file.raw, file.raw.name)
          })
          this.fileList3.forEach(file => {
            console.log('我是jczlsmyj', file)
            // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
            formData.append('jczlsmyj', file.raw, file.raw.name)
          })
          this.fileList4.forEach(file => {
            console.log('我是jkrbjzl', file)
            // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
            formData.append('jkrbjzl', file.raw, file.raw.name)
          })
          this.fileList5.forEach(file => {
            console.log('我是qtzl', file)
            // 此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
            formData.append('qtzl', file.raw, file.raw.name)
          })
          api.draft(formData).then(response => {
            this.$myloading.hide()
            this.msgSuccess('暂存成功')
            this.open = false
            this.reset()
            this.getList()
          })
        }
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row)
      let ids = []

      if (row.id == null) {
        ids = this.ids
      } else {
        ids = [row.id]
      }
      // const ids = row.id || this.ids
      this.$confirm('是否确认删除请假编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        var param = {
          'ids': ids
        }
        return api.del(param)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 回显文件列表 */
    fileList(fileList, filePaths) {
      for (let i = 0; i < filePaths.length; i++) {
        let file = null
        this.getFileFromUrl(filePaths[i].split('/')[filePaths[i].split('/').length - 1],
          this.$imgbaseurl + filePaths[i]).then((response) => {
          console.log(response)
          file = response
          fileList.push({
            name: file.name,
            raw: file
          })
        })

        //     fileList.push({
        //         name: filePaths[i].split('/')[filePaths[i].split('/').length - 1],
        //         url: this.$imgbaseurl + filePaths[i]
        //     })
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有请假数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return api.exportExcel(queryParams)
      }).then(response => {
        this.download(response.message)
      })
    }
  }
}

</script>
<style >
.el-tag--medium {
    margin-left: 40px;
    height: 28px;
    line-height: 26px;
}
</style>
