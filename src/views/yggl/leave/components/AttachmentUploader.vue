<template>
  <div>
    <el-form-item :label="name" class="mb8">
      <el-input :size="size" :value="fileName" :placeholder="placeholder" readonly clearable>
        <template v-slot:prepend>
          <el-button icon="el-icon-document" :size="size" @click="openSelect">选择文件</el-button>
          <input
            ref="hiddenInput"
            accept="image/*"
            name="input"
            style="display: none"
            type="file"
            @change="handleChange($event.target.files[0])"
          >
        </template>
        <template v-slot:append>
          <el-popover
            placement="left"
            width="800"
            trigger="hover"
            :disabled="!showPreview"
          >
            <div style="text-align: center;font-weight: bold;margin-bottom: 5px">
              <el-tag>{{ name }}</el-tag>
            </div>
            <el-image v-if="showPreview" fit="fill" alt="请选择文件" :src="src" />
            <div v-else>请选择文件</div>
            <template v-slot:reference>
              <el-button icon="el-icon-search" :size="size">预览</el-button>
            </template>
          </el-popover>
          <el-divider direction="vertical" />
          <el-button :loading="uploading" icon="el-icon-upload" :size="size" @click="submitUpload">上传</el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item v-if="hasExtra" :label="extra.name" :required="true" class="mb8">
      <el-date-picker
        v-if="hasExtra"
        v-model="extra.value"
        value-format="yyyy-MM-dd"
        align="center"
        style="width: 100%"
        :placeholder="extra.placeholder"
        :type="extra.comp"
      />
    </el-form-item>
  </div>
</template>

<script>
import api from '@/api/em/tEmUser'

export default {
  name: 'AttachmentUploader',
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    value: {
      type: [File, String],
      require: true,
      default: null
    },
    type: {
      type: String,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    userId: {
      type: String,
      require: true
    },
    size: {
      type: String,
      require: false,
      default: 'medium'
    },
    placeholder: {
      type: String,
      require: false,
      default: '请点击左侧按钮选择文件'
    },
    extra: {
      type: Object,
      require: false
    }
  },
  data() {
    return {
      uploading: false
    }
  },
  computed: {
    tempFile: {
      get() {
        return this.value
      },
      set(val) {
        console.log('set', val)
        this.$emit('update', val)
      }
    },
    showPreview() {
      return this.src != null
    },
    src() {
      if (this.value != null) {
        if (this.value instanceof File) {
          return URL.createObjectURL(this.value)
        } else {
          return this.value
        }
      } else {
        return null
      }
    },
    fileName() {
      if (this.value != null) {
        if (this.value instanceof File) {
          return this.value.name
        } else {
          return this.value.substring(this.value.lastIndexOf('/') + 1)
        }
      } else {
        return null
      }
    },
    hasExtra() {
      return !!this.extra
    }
  },
  methods: {
    openSelect() {
      this.$refs.hiddenInput.click()
    },
    handleChange(file) {
      if (!file.type.startsWith('image')) {
        this.$message.error('只能选择图片类型的文件')
        return false
      }
      if (this.src) {
        URL.revokeObjectURL(this.src)
      }
      this.$emit('update', file)
    },
    clear() {
      this.$refs.hiddenInput.value = null
      URL.revokeObjectURL(this.src)
    },
    /* 提交上传，重置表单 */
    async submitUpload() {
      const hasValue = !!this.value && (this.value instanceof File)
      if (!hasValue) {
        this.$message.warning('请选择一个文件')
        return false
      }
      if (this.hasExtra) {
        if (!this.extra.value) {
          this.$message.warning('请选择时间')
          return false
        }
      }
      try {
        this.uploading = true
        const form = this.getFormData()
        const data = await api.uploadAttachment(form)
        if (data.code === 200) {
          this.$message.success('附件上传成功')
        }
      } catch (e) {
        console.error(e)
        this.$message.error('提交失败，请重试或联系管理员')
      } finally {
        this.uploading = false
      }
    },
    getFormData() {
      const form = new FormData()
      form.set('userId', this.userId)
      form.set('type', this.type)
      form.set('file', this.value)
      form.set('extraType', this.extra.type)
      form.set('extraValue', this.extra.value)
      return form
    }
  }
}
</script>

<style scoped>

</style>
