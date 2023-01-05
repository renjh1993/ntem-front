<template>
  <el-dialog title="上传报文配置Excel" :visible.sync="upload.open" modal modal-append-to-body width="400px" append-to-body>
    <el-button type="warning" @click="dowmloadTmp">下载模板</el-button>
    <el-form ref="importExcelForm" :model="importForm" :rules="rules">
      <el-form-item label="报文名" prop="pubfldname">
        <el-input ref="excelPubfldname" v-model="importForm.pubfldname" />
      </el-form-item>
      <el-form-item label="报文类型" prop="srcFmtType">
        <el-radio-group v-model="importForm.srcFmtType">
          <el-radio :label="180">JSON</el-radio>
          <el-radio :label="150">XML</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="file">
        <el-upload
          ref="uploadExcel"
          :limit="1"
          accept=".xlsx"
          :headers="upload.headers"
          :action="upload.url"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
          :auto-upload="false"
          drag
          :data="importForm"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div slot="tip" class="el-upload__tip" style="color:red">提示：仅允许导入“.xlsx”或“xls”格式文件！</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitFileForm('importExcelForm')">确 定</el-button>
      <el-button @click="uploadCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'UploadExcel',
  data() {
    return {
      visible: false,
      importForm: {},
      // 表单校验
      rules: {
        pubfldname: [
          { required: true, message: '报文名不能为空', trigger: 'blur' }
        ]
      },
      // 上传参数
      upload: {
        // 上传弹窗
        open: false,
        // 弹窗标题
        title: '上传文件',
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/fmtPubfld/uploadExcel'
      },
      fileList: 0,
      // 加载层
      loading: []
    }
  },
  methods: {
    init() {
      const _this = this
      this.resetImForm()
      this.upload.open = true
      setTimeout(function() {
        _this.$refs['excelPubfldname'].focus()
      }, 1)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList.length
    },
    handleFileRemove(file, fileList) {
      this.fileList = fileList.length
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.uploadExcel.clearFiles()
      this.$alert(response.data, '导入结果', { dangerouslyUseHTMLString: true })
      this.fileList = 0
      this.loading.close()
      this.$parent.getList()
    },
    // 上传
    submitFileForm(fromName) {
      if (this.fileList === 0) {
        this.$message({
          type: 'warning',
          message: '请先上传文件'
        })
      } else if (this.importForm.pubfldname === '') {
        this.$message({
          type: 'warning',
          message: '请先输入报文名'
        })
      } else {
        this.openLoading()
        this.$refs.uploadExcel.submit()
      }
    },
    uploadCancel() {
      this.upload.open = false
      this.fileList = 0
      this.$refs.uploadExcel.clearFiles()
    },
    resetImForm() {
      this.importForm = {
        pubfldname: '',
        srcFmtType: 180,
        dataType: '0'
      }
      this.resetForm('importForm')
    },
    dowmloadTmp() {
      window.open(process.env.VUE_APP_BASE_API + '/system/fmtPubfld/exportExcel')
    },
    // 打开加载层
    openLoading() {
      this.loading = this.$loading({
        lock: true,
        text: '正在上传处理中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
  }
}
</script>

<style scoped>

</style>
