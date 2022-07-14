<template>
  <el-dialog title="新建" :visible.sync="dialogVisible" width="60%" customClass="flowCreate">
      <el-scrollbar wrap-class="scrollbar-wrapper" style="height:calc(100% - 20px);margin:0px auto 20px">
        <el-form ref="createForm" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="流程名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择流程类型">
              <el-option label="流程模板" value="01"></el-option>
              <el-option label="交易流程" value="02"></el-option>
              <el-option label="子流程" value="03"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="参数二">
            <el-checkbox-group v-model="form.param2">
              <el-checkbox label="属性一"></el-checkbox>
              <el-checkbox label="属性二"></el-checkbox>
              <el-checkbox label="属性三"></el-checkbox>
              <el-checkbox label="属性四"></el-checkbox>
            </el-checkbox-group>
          </el-form-item> -->
          <el-form-item label="描述">
            <el-input type="textarea" v-model="form.describe"></el-input>
          </el-form-item>
          <!-- <el-form-item label="生成公共模块">
            <el-switch v-model="form.isModel"></el-switch>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button @click="dialogVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-dialog>
</template>

<script>
    import { addFlow } from "@/api/flow/flow"
    import { addCmpDef } from "@/api/configuration/cmpDef";
    export default {
        name: '',
        data() {
            return {
                dialogVisible: false,
                form: {
                    id : '',
                    name: '',
                    param1: '',
                    param2: [],
                    describe: ''
                },
              // 表单校验
              rules: {
                name: [
                  { required: true, message: "流程名字不能为空", trigger: "blur" }
                ],
                type: [
                  { required: true, message: "流程类型不能为空", trigger: "blur" }
                ]
              },
            }
        },
        methods: {
            init() {
                this.form = {
                  id : '',
                  name: '',
                  param1: '',
                  param2: [],
                  describe: ''
                }
                this.dialogVisible = true
            },
            onSubmit() {
                this.$refs['createForm'].validate(valid => {
                  if (valid) {
                    addFlow(this.form).then(response => {
                      console.log("flow", response)
                      this.form.id = response.data.flowTplPk
                      this.msgSuccess("成功新增流程")
                      if (this.form.type === '03') {
                        console.log("23iehu23iybv", this.form)
                        let subFlowCmp = {
                          beanName: this.form.name,
                          sdesc: this.form.describe,
                          cmpTypeCd: '190',
                          cmpTypeNm: '子流程组件',
                          subFlowTplPk: this.form.id
                        }
                        addCmpDef(subFlowCmp)
                      }
                    })
                  }
                })
                this.$emit('flowNew', this.form)
                this.dialogVisible = false
            }
        }
    }
</script>
<style>
    .flowCreate {
        height: calc(100% - 15vh - 50px) !important;
        margin: 15vh auto 50px !important;
        overflow: hidden;
    }

    .flowCreate .el-dialog__body {
        height: calc(100% - 110px) !important;
        padding: 10px 20px !important;
    }

    .flowCreate .el-scrollbar__view {
        height: calc(100% - 100px) !important;
    }

    .el-scrollbar__wrap {
        overflow-x: hidden !important;
    }

    .folw-tool i {
        display: inline-block;
        width: 27px;
        height: 27px;
        margin: 0 6px;
        padding-top: 10px;
        text-align: center;
        border: 1px solid #fff;
        cursor: pointer;
    }

    .folw-tool i:hover {
        border: 1px solid #e6e9ed;
    }
</style>
