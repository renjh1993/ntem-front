<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :visible.sync="isShow"
    :title="title"
  >
    <attachment-upload-form ref="uploadForm" :items="items" :user-id="userId" />
    <template v-slot:footer>
      <div style="text-align: center">
        <el-button type="danger" @click="cancel">关闭</el-button>
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
    uploading: {
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
    },
    userId: {
      type: String,
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
