<template>
  <el-dialog :visible.sync="isShow">
    <!--    <el-upload action="" :multiple="false" name="2寸照片" />-->
    <uploader name="照片" :value="fileOne" />
  </el-dialog>
</template>

<script>
import uploader from '@/views/yggl/leave/components/Uploader.vue'

export default {
  name: 'AttachmentUploadDialog',
  components: {
    uploader
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
    }
  },
  data() {
    return {
      fileOne: null
    }
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
  methods: {}
}
</script>

<style scoped>

</style>
