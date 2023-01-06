<template>
  <el-form ref="uploadForm" label-position="right" label-width="120px" class="form-margin">
    <el-form-item v-for="(item,index) in items" :key="index" :label="item.name" class="mb">
      <attachment-uploader ref="uploader" v-model="item.value" :name="item.name" :placeholder="item.placeholder" />
    </el-form-item>
  </el-form>
</template>

<script>
import attachmentUploader from '@/views/yggl/leave/components/AttachmentUploader.vue'

export default {
  name: 'UploadForm',
  components: {
    attachmentUploader
  },
  props: {
    items: {
      type: Array,
      require: true
    }
  },
  methods: {
    clear() {
      this.$refs.uploader.forEach(uploader => {
        uploader.clear()
      })
    }
  }
}
</script>

<style scoped>
.form-margin {
  margin: 0 20px;
}

.mb {
  margin-bottom: 12px;
}
</style>
