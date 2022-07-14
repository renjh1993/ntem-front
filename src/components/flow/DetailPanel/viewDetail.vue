<template>
    <div class="detailpannel">
        <el-scrollbar wrap-class="scrollbar-wrapper" style="height: 100%">
            <div v-if="status=='node-selected'" class="pannel" id="node_detailpannel">
                <div class="pannel-title">模型详情</div>
                <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
                    <el-tab-pane label="基本属性" name="base">
                        <el-form :model="node" label-position="left" size="mini">
                          <el-form-item label="nodeId:" label-width="80px">
                            <el-input v-model="node.id" :disabled="true"></el-input>
                          </el-form-item>
                          <el-form-item label="组件名:" label-width="60px" >
                            <el-input v-model="node.label" :disabled="true" ia></el-input>
                          </el-form-item>
                          <el-form-item label="beanName:" label-width="80px">
                            <el-input v-model="node.beanName" :disabled="true" type="textarea"></el-input>
                          </el-form-item>
                        </el-form>
                        <el-form :model="formData" ref="'nodeForm_base" label-position="left">
                            <el-form-item :label="item.paramVarName + ':'" v-for="(item,index) in (formData.base)" :key="index">
                                <el-select disabled v-if="item.showType === '2'" v-model="formData.base[index].paramValue">
                                  <el-option v-for="(secItem, secindex) in (JSON.parse(item.showValue))" :key="secItem.value" :label="secItem.label" :value="secItem.value"/>
                                </el-select>
                                <el-input disabled v-else v-model="item.paramValue">
                                    <i slot="suffix" class="el-input__icon" v-model="item.isDefault"
                                            :class="[item.isDefault==='1' ? 'el-icon-lock' : 'el-icon-unlock']"></i>
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="入参" name="input">
                        <el-form :model="formData" ref="nodeForm_input" label-position="left">
                            <el-form-item :label="item.paramVarName + ':'" v-for="(item, index) in (formData.input)"
                                :key="index">
                                <el-select disabled v-if="item.showType === '2'" v-model="formData.input[index].paramValue">
                                  <el-option v-for="(secItem, secindex) in (JSON.parse(item.showValue))" :key="secItem.value" :label="secItem.label" :value="secItem.value"/>
                                </el-select>
                                <el-input v-model="item.paramValue" disabled
                                          @blur="item_blur('input',index)" @keydown.delete.native.stop="">
                                  <i slot="suffix" class="el-input__icon" v-model="item.isDefault"
                                     :class="[item.isDefault==='1' ? 'el-icon-lock' : 'el-icon-unlock']"></i>
                                </el-input>
                            </el-form-item>
                        </el-form>
                        <div class="no-params" v-if="formData.input.length==0">暂未配置参数</div>
                    </el-tab-pane>
                    <el-tab-pane label="出参" name="output">
                        <el-form :model="formData" ref="nodeForm_output" label-position="left">
                            <el-form-item :label="item.paramVarName + ':'" v-for="(item,index) in (formData.output)"
                                :key="index">
                                <el-select disabled v-if="item.showType === '2'" v-model="formData.output[index].paramValue">
                                  <el-option v-for="(secItem, secindex) in (JSON.parse(item.showValue))" :key="secItem.value" :label="secItem.label" :value="secItem.value"/>
                                </el-select>
                                <el-input disabled v-model="item.paramValue"
                                    @blur="item_blur('output',item)" @keydown.delete.native.stop="">
                                    <i slot="suffix" class="el-input__icon" v-model="item.isDefault"
                                        :class="[item.isDefault==='1' ? 'el-icon-lock' : 'el-icon-unlock']"></i>
                                </el-input>
                            </el-form-item>
                        </el-form>
                        <div class="no-params" v-if="Object.keys(formData.output).length==0">暂未配置参数</div>
                    </el-tab-pane>
                </el-tabs>
                <div class="submit-button" v-show="submitBtnVisible">
<!--                    <el-button icon="el-icon-close" @click="resetForm('numberValidateForm')">重置</el-button>-->
<!--                    <el-button type="primary" v-show="this.formData.base.length !== 0 || this.formData.input.length !== 0 || this.formData.output.length !== 0" icon="el-icon-check" @click.prevent="handleNodeSubmit">保存</el-button>-->
                </div>
            </div>
            <div v-if="status=='edge-selected'" class="pannel" id="edge_detailpannel">
                <div class="pannel-title">接线详情</div>
                <div class="block-container">
                    <el-row :gutter="10">
                        <el-col :span="4">条件</el-col>
                        <el-col :span="20">
                            <el-input placeholder="请输入内容" v-model="edge.condition" class="input-with-select"
                                @change="handleEdgeChange(edge)" @keydown.delete.native.stop="">
                                <el-select v-model="edge.flag" @change=handleEdgeChange(edge) slot="prepend"
                                    placeholder="请选择">
                                    <el-option label="表达式" value="0"></el-option>
                                    <el-option label="函数" value="1"></el-option>
                                </el-select>
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="4">颜色</el-col>
                        <el-col :span="20">
                            <el-input v-model="edge.textColor" @change="handleEdgeChange(edge)"
                                @keydown.delete.native.stop="" />
                        </el-col>
                    </el-row>
                </div>
                <div class="submit-button">
                    <el-button icon="el-icon-close">重置</el-button>
                    <el-button type="primary" icon="el-icon-check" @click.prevent="handleNodeSubmit">保存</el-button>
                </div>
            </div>
            <div v-if="status==='canvas-selected'" class="pannel" id="canvas_detailpannel">
                <div class="pannel-title">流程</div>
                <div class="block-container">
                    <el-row :gutter="10">
                        <el-col :span="6">名称</el-col>
                        <el-col :span="18">
                            <el-input v-model="ProjectData.name" disabled @change="handleProjectChange"
                                @keydown.delete.native.stop="" />
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="6">ID</el-col>
                        <el-col :span="18">
                            <el-input v-model="ProjectData.id" disabled @change="handleProjectChange"
                                @keydown.delete.native.stop="" />
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="6">类型</el-col>
                        <el-col :span="18">
                            <el-input v-model="ProjectData.type" disabled @change="handleProjectChange"
                                @keydown.delete.native.stop="" />
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="6">描述</el-col>
                        <el-col :span="18">
                            <el-input v-model="ProjectData.describe" disabled @change="handleProjectChange"
                                @keydown.delete.native.stop="" />
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="6">网格对齐</el-col>
                        <el-col :span="18">
                            <el-checkbox v-model="showGrid" @change="changeGridState"></el-checkbox>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <!-- <div v-if="status==='group-selected'" class="pannel" id="node_detailpannel">
        <div class="pannel-title">群组详情</div>
        <div class="block-container">
          <div class="p">
            名称：
            <el-input v-model="name" />
          </div>
          <div class="p">
            任意属性：
            <el-input v-model="color" />
          </div>
        </div>
      </div>
      -->
        </el-scrollbar>
    </div>
</template>

<script>
    import eventBus from "@/utils/flow/eventBus";
    import Grid from "@antv/g6/build/grid";
    import {
        getFlowTplCmpParams,
        searchCmpParams,
        setProperty
    } from '@/api/flow/menu';
    import{ saveFlowTpl, saveFlowTplCmpParams } from '@/api/flow/flow'
    import item from '../ItemPanel/item'
    export default {
      data() {
        return {
          status: "canvas-selected",
          showGrid: false,
          disableList: 'label, type, x, y, id',
          page: {},
          graph: {},
          item: {},
          node: {},
          edge: {},
          textColor: 'rgba(19, 206, 102, 0.8)',
          grid: null,
          formData: {
            base: [],
            input: [],
            output: []
          },
          activeName: 'base',
          submitBtnVisible: false,
          ProjectData: {
            'name': '',
            'id': '',
            'describe': '',
            'type': '',
            'nodes': [],
            'edges': []
          },
        };
      },
      created() {
        this.init();
        this.bindEvent();
      },
      methods: {
        init() {
        },
        bindEvent() {
          let self = this;
          eventBus.$on("afterAddPage", page => {
            self.page = page;
            self.graph = self.page.graph;
            eventBus.$on("nodeselectchange", item => {
              // console.log('nodeselectchange', item)
              if (item.select === true && item.target.getType() === "node") {
                self.status = "node-selected";
                self.item = item.target;
                self.node = item.target.getModel();
                self.getNodeParams(self.node, self.node.nodeType)
              } else if (item.select === true && item.target.getType() === "edge") {
                self.status = "edge-selected";
                self.item = item.target;
                self.edge = item.target.getModel();
              } else {
                self.status = "canvas-selected";
                self.item = null;
                self.node = null;
              }
            });
            eventBus.$on("projectChange", item => {
              // Object.assign(this.ProjectData, item);
              this.ProjectData = item
              self.status = "canvas-selected";
              self.item = null;
              self.node = null;
            });
            eventBus.$on("observer-flow", item => {
              this.ProjectData.name = item.tplName
              this.ProjectData.id = item.flowTplPk
              this.ProjectData.type = item.tplType
              this.ProjectData.describe = item.sdesc
            })
          });
        },
        item_blur(key, subkey) {
          setTimeout(() => {
            this.formData.key[subkey].isDefault = this.formData.key[subkey].isDefault === true ? true : null
          }, 150)
        },
        handleProjectChange() {
          eventBus.$emit('projectChange', this.ProjectData)
        },
        changeGridState(value) {
          if (value) {
            this.grid = new Grid();
            this.graph.addPlugin(this.grid);
          } else {
            this.graph.removePlugin(this.grid);
          }
        },
        handleTabClick() {

        },
        handleNodeSubmit() {
          let InfoData = Object.assign(this.ProjectData, this.graph.save());
          let result = this.checkSE(InfoData.nodes)
          if (result) {
            saveFlowTpl(InfoData).then(response => {
              let cmpParams = this.formData.base.concat(this.formData.input.concat(this.formData.output))
              let data = {
                flowTplPk: this.ProjectData.id,
                flowTplCmpId: this.node.id,
                // params: (this.formData.base.concat(this.formData.input.concat(this.formData.output))).toString()
                cmpParams: JSON.stringify(cmpParams)
              }
              saveFlowTplCmpParams(data).then(response => {
                this.msgSuccess("保存成功")
              })
            })
          } else {
            this.msgError("保存失败:请先添加流程开始或结束节点")
          }
        },
        getNodeParams(nodeData, nodeclass) {
          this.formModel = {};
          const req = {
            // type: nodeclass
            flowTplPk: this.ProjectData.id,
            flowTplCmpId: nodeData.id
          }
          //获取节点基本参数
          getFlowTplCmpParams(req).then(response => {
            this.formData = {
              base: [],
              input: [],
              output: []
            }
            let formData = []
            formData = response.data;
            if (formData.length === 0) {
              const beanName = nodeData.beanName
              searchCmpParams(beanName).then(response => {
                formData = response.data
                for (let i in formData) {
                  formData[i].isDefault = '0'
                  if (formData[i].paramTypeCd === '01') {
                    this.formData.input.push(formData[i])
                  } else if (formData[i].paramTypeCd === '02') {
                    this.formData.output.push(formData[i])
                  } else if (formData[i].paramTypeCd === '03') {
                    this.formData.base.push(formData[i])
                  }
                }
              })
            } else {
              for (let i in formData) {
                if (formData[i].paramTypeCd === '01') {
                  this.formData.input.push(formData[i])
                } else if (formData[i].paramTypeCd === '02') {
                  this.formData.output.push(formData[i])
                } else if (formData[i].paramTypeCd === '03') {
                  this.formData.base.push(formData[i])
                }
              }
            }
            // formData.base.label.value = nodeData.label;
            // formData.base.id.value = nodeData.id;
            // delete formData.base.x;
            // delete formData.base.y;
            // this.formData = formData;
            this.submitBtnVisible = true;
          })
        },
        handleNodeChange(base) {
          //console.log(123, base, base.IS_ASYN)
          const model = {
            label: base.label.value,
            IS_ASYN: base.IS_ASYN.value
          };
          this.graph.update(this.item, model);
        },
        handleEdgeChange(edge) {
          const model = {
            label: edge.label,
            condition: edge.condition,
            textColor: edge.textColor,
            flag: edge.flag
          };
          this.graph.update(this.item, model);
        },
        handleEdgeSubmit() {

        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        checkSE(arr) {
          for (let item of arr) {
            console.log(321, item)
            if (item.nodeType === "start") {
              for (let item of arr) {
                if (item.nodeType === "end") {
                  return true
                }
              }
            }
          }
        }
      }
    }
</script>

<style scoped>
    .detailpannel {
        height: calc(100% - 170px);
        position: absolute;
        right: 0px;
        z-index: 2;
        background: #f7f9fb;
        width: 240px;
        border-left: 1px solid #e6e9ed;
    }

    .detailpannel .block-container {
        padding: 16px 8px;
    }

    .block-container .el-col {
        height: 28px;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .pannel-title {
        height: 32px;
        border-top: 1px solid #dce3e8;
        border-bottom: 1px solid #dce3e8;
        background: #ebeef2;
        color: #000;
        line-height: 28px;
        padding-left: 12px;
    }

    .no-params {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        text-indent: 1em;
    }

    .submit-button {
        margin-left: 10px;
        margin-bottom: 20px;
    }

    /deep/.el-form {
        width: calc(100% - 20px) !important;
        margin: 0 auto !important;
    }

    /deep/.el-icon-lock {
        color: #409EFF !important;
    }

    /deep/.el-select-dropdown__wrap {
        margin-bottom: -5px !important;
    }

    /deep/.el-scrollbar__wrap {
        margin-bottom: -5px !important;
    }
</style>
