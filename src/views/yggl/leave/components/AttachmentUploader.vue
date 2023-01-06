<template>
  <el-input :size="size" :value="fileName" :placeholder="placeholder" readonly clearable>
    <template v-slot:prepend>
      <el-button icon="el-icon-document" :size="size" @click="openSelect">选择文件</el-button>
      <input
        ref="hiddenInput"
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
      >
        <el-image v-if="showPreview" fit="fill" alt="请选择文件" :src="src" />
        <div v-else>请选择文件</div>
        <template v-slot:reference>
          <el-button icon="el-icon-search" :size="size">预览</el-button>
        </template>
      </el-popover>
    </template>
  </el-input>
</template>

<script>
export default {
  name: 'AttachmentUploader',
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    value: {
      type: File,
      require: true,
      default: null
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
    }
  },
  data() {
    return {
      fileName: null,
      src: null
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
      return !!this.src
    }
  },
  methods: {
    openSelect() {
      this.$refs.hiddenInput.click()
    },
    handleChange(file) {
      this.fileName = file.name
      URL.revokeObjectURL(this.src)
      this.src = URL.createObjectURL(file)
      this.$emit('update', file)
    },
    clear() {
      this.$refs.hiddenInput.value = null
      this.fileName = null
      URL.revokeObjectURL(this.src)
      this.src = null
    }
  }
}
</script>

<style scoped>

</style>
