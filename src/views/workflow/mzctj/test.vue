<template>
  <div id="app">
    <el-cascader
      size="large"
      :options="options"
      v-model="selectedOptions"
      @change="handleChange"
    >
    </el-cascader>
  </div>
</template>
<script>


import { regionData, CodeToText } from "element-china-area-data";
export default {
  name: "App",
  components: {},
  data() {
    return {
      options: regionData,
      selectedOptions: [],
    };
  },
  methods: {
    handleChange() {
      var loc1 = "";
       var loc2 = "";
    //   for (let i = 0; i < this.selectedOptions.length; i++) {
    //     loc += CodeToText[this.selectedOptions[i]];
    //   }
loc1 = CodeToText[this.selectedOptions[0]]+CodeToText[this.selectedOptions[1]];
loc2 = CodeToText[this.selectedOptions[2]]
     console.log(loc1+"==="+loc2); //打印出来汉字城市
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
