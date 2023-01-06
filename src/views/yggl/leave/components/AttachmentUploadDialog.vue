<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isShow"
    :title="title"
  >
    <attachment-upload-form ref="uploadForm" :items="items" />
    <template v-slot:footer>
      <div style="text-align: center">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button type="danger" @click="cancel">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import attachmentUploadForm from '@/views/yggl/leave/components/AttachmentUploadForm.vue'

export default {
  name: 'AttachmentUploadDialog',
  components: {
    attachmentUploadForm
  },
  model: {
    prop: 'show',
    event: 'update'
  },
  props: {
    show: {
      type: Boolean,
      default: false,
      require: true
    },
    title: {
      type: String,
      default: '上传文件',
      require: false
    },
    items: {
      type: Array,
      require: true
    }
  },
  data() {
    return {}
  },
  computed: {
    isShow: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit('update', value)
      }
    }
  },
  methods: {
    submit() {
      this.$emit('submit')
    },
    cancel() {
      this.$emit('cancel')
    },
    clear() {
      this.$refs.uploadForm.clear()
    }
  }
}
</script>

<style scoped>

</style>
