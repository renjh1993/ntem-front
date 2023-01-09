<template>
  <el-form ref="uploadForm" label-position="right" label-width="120px" class="form-margin">
    <div v-for="(item,index) in items" :key="index">
      <attachment-uploader
        v-if="!item.comp"
        ref="uploader"
        v-model="item.value"
        :user-id="userId"
        :type="item.type"
        :name="item.name"
        :placeholder="item.placeholder"
        :extra="item.extra"
      />
      <hr style="background-color:#bdbcbc; height:1px; border:none;">
    </div>
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
    },
    userId: {
      type: String,
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

</style>
