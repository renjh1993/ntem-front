<template>
  <div>
    <label for="input"> {{ name }}: </label>
    <input name="input" type="file" @change="handleChange($event.target.files[0])">
    <el-popover
      v-model="showPreview"
      placement="right"
      title="标题"
      width="200"
      trigger="manual"
    >
      <el-image v-if="showPreview" :src="value" />
      <template v-slot:reference>
        <el-button size="mini" @click="showPreview=!showPreview">预览</el-button>
      </template>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'Uploader',
  props: {
    name: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      value: null,
      showPreview: false
    }
  },
  methods: {
    handleChange(file) {
      console.log(file)
      this.value = URL.createObjectURL(file)
    }
  }
}
</script>

<style scoped>

</style>
