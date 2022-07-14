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
                            <el-input v-model="node.beanName" :disabled="true" type="textarea" />
                          </el-form-item>
                        </el-form>
                        <el-form :model="formData" ref="'nodeForm_base" label-position="left">
                            <el-form-item :label="item.paramVarName + ':'" v-for="(item,index) in (formData.base)" :key="index">
                                <el-select clearable @blur="item_blur()" v-if="item.showType === '2'" v-model="formData.base[index].paramValue">
                                  <el-option v-for="(secItem, secindex) in (JSON.parse(item.showValue))" :key="secItem.value" :label="secItem.label" :value="secItem.value"/>
                                </el-select>
                                <el-input v-else v-model="formData.base[index].paramValue" :disabled="item.isDefault==='1'"
                                    @blur="item_blur()" @keydown.delete.native.stop=""
                                >
                                    <i slot="suffix" class="el-input__icon" v-model="item.isDefault"
                                            :class="[item.isDefault==='1' ? 'el-icon-lock' : 'el-icon-unlock']"></i>
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="入参" name="input">
                        <el-form :model="formData" ref="nodeForm_input" label-position="left">
                          <el-form-item label="请选择" v-if="node.beanName ==='componentTransport'">
                            <el-button
                              @click="openBndDia"
                              v-loading.fullscreen.lock="fullscreenLoading"
                              type="info"
                            >提供方组件</el-button>
                          </el-form-item>
                            <el-form-item :label="item.paramVarName + ':'" v-for="(item, index) in (formData.input)"
                                :key="index">
                                <el-select clearable @blur="item_blur()" v-if="item.showType === '2'" v-model="formData.input[index].paramValue">
                                  <el-option v-for="(secItem, secindex) in (JSON.parse(item.showValue))" :key="secItem.value" :label="secItem.label" :value="secItem.value"/>
                                </el-select>
                                <el-input v-else v-model="item.paramValue" :disabled="item.isDefault==='1' || node.beanName ==='componentTransport'"
                                          @blur="item_blur()" @keydown.delete.native.stop="">
                                  <i v-show="node.beanName !=='componentTransport'" slot="suffix" class="el-input__icon" v-model="item.isDefault"
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
                                <el-select clearable @blur="item_blur()" v-if="item.showType === '2'" v-model="formData.output[index].paramValue">
                                  <el-option v-for="(secItem, secindex) in (JSON.parse(item.showValue))" :key="secItem.value" :label="secItem.label" :value="secItem.value"/>
                                </el-select>
                                <el-input v-else v-model="item.paramValue" :disabled="item.isDefault === '1'"
                                    @blur="item_blur()">
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
                    <el-button type="primary" v-show="this.formData.base.length !== 0 || this.formData.input.length !== 0 || this.formData.output.length !== 0" icon="el-icon-check" @click.prevent="handleNodeSubmit">保存</el-button>
                </div>
            </div>
            <div v-if="status=='edge-selected'" class="pannel" id="edge_detailpannel">
                <div class="pannel-title">接线详情</div>
                <div class="block-container">
                    <el-row :gutter="10">
                        <el-col :span="6">条件</el-col>
                        <el-col :span="14">
                            <el-select disabled v-model="edge.flag" placeholder="请选择">
                                <el-option label="表达式" value="0"></el-option>
                                <el-option label="函数" value="1"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                      <el-col :span="6"></el-col>
                      <el-col :span="18">
                        <el-input placeholder="函数或表达式" disabled v-model="edge.condition" />
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="6">颜色</el-col>
                        <el-col :span="18 ">
                            <el-input v-model="edge.textColor" disabled />
                        </el-col>
                    </el-row>
                    <el-row :gutter="10" v-show="showEdgeInfo">
                      <el-col :span="8">是否异步</el-col>
                      <el-col :span="16">
                        <el-radio-group v-model="edge.async" disabled>
                          <el-radio :label="'true'">是</el-radio>
                          <el-radio :label="'false'">否</el-radio>
                        </el-radio-group>
                      </el-col>
                    </el-row>
                </div>
<!--                <div class="submit-button">-->
<!--                    <el-button icon="el-icon-close">重置</el-button>-->
<!--                    <el-button type="primary" icon="el-icon-check" @click.prevent="handleNodeSubmit">保存</el-button>-->
<!--                </div>-->
            </div>
            <div v-if="status==='canvas-selected'" class="pannel" id="canvas_detailpannel">
                <div class="pannel-title">交易配置</div>
                <div class="block-container">
                    <el-row :gutter="10">
                        <el-col :span="8">流程名称</el-col>
                        <el-col :span="16">
                            <el-input v-model="ProjectData.name" disabled @change="handleProjectChange"
                                @keydown.delete.native.stop="" />
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="8">流程ID</el-col>
                        <el-col :span="16">
                            <el-input v-model="ProjectData.id" disabled @change="handleProjectChange"
                                @keydown.delete.native.stop="" />
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="8">流程类型</el-col>
                        <el-col :span="16">
                            <el-input v-model="ProjectData.type" disabled @change="handleProjectChange"
                                @keydown.delete.native.stop="" />
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="8">流程描述</el-col>
                        <el-col :span="16">
                            <el-input v-model="ProjectData.describe" disabled @change="handleProjectChange"
                                @keydown.delete.native.stop="" />
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="8">网格对齐</el-col>
                        <el-col :span="16">
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
      <bnd-dia v-show="bndDiaVis" ref="bndDia" @rowData="getDataFromDia"/>
      <sub-flow-param v-show="paramDiaVis" ref="paramDia" />
    </div>
</template>

<script>
    import BndDia from "./bndDia"
    import SubFlowParam from './subFlowParam'
    import eventBus from "@/utils/flow/eventBus";
    import Grid from "@antv/g6/build/grid";
    import {
        getFlowTplCmpParams,
        searchCmpParams,
    } from '@/api/flow/menu';
    import { saveFlowTpl, saveFlowTplCmpParams } from '@/api/flow/flow'
    import { searchSvcFlowCmpParams, saveSvcFlowCmpParams } from  '@/api/flow/svcFlow'
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
          fullscreenLoading: false,
          bndDiaVis: false,
          subFlowList: [],
          customBeanNameVal: null,
          paramDiaVis: false,
          nodeParams: {
            save: {},
            del: {}
          },
          showEdgeInfo: false
        };
      },
      components: {
        BndDia,
        SubFlowParam
      },
      props: [
        'intfId'
      ],
      created() {
        this.init();
        this.bindEvent();
        this.getSubFlowList();
        this.updateNodeParams()
      },
      methods: {
        init() {
          this.nodeParams = {
            save: {},
            del: {}
          }
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
                if (self.nodeParams.save[self.node.id]) {
                  self.getParamsFromCache(self.node, self.node.nodeType)
                } else {
                  self.getNodeParams(self.node, self.node.nodeType)
                }
                // self.getNodeParams(self.node, self.node.nodeType)
                // self.getNodeParams(self.node)
              } else if (item.select === true && item.target.getType() === "edge") {
                self.status = "edge-selected";
                self.item = item.target;
                self.edge = item.target.getModel();
                let sendNode = item.target.getSource().getModel()
                if (sendNode.beanName === 'fork') {
                  self.showEdgeInfo = true
                } else {
                  self.showEdgeInfo = false
                }
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
            });
            eventBus.$on("putCustomBeanName", item =>{
              this.nodeParams.save[item.target.nodeId].customBeanNameVal = item.target.beanName
            })
            eventBus.$on("putCustomBeanName", item =>{
              this.nodeParams.save[item.target.nodeId]['customBeanNameVal'] = item.target.beanName
            })
          });
        },
        item_blur() {
          let self = this
          self.nodeParams.save[self.node.id].cmpParams = self.formData
          if (self.node.nodeType === 'customComponent' && self.nodeParams.save[self.node.id].customBeanNameVal) {
            self.nodeParams.save[self.node.id].customBeanNameVal = self.formData.base[0].paramValue
          }
          // setTimeout(() => {
          //   this.formData.key[subkey].isDefault = this.formData.key[subkey].isDefault === true ? true : null
          // }, 150)
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
          // let result = this.checkSE(InfoData.nodes)
          let cmpParams = this.formData.base.concat(this.formData.input.concat(this.formData.output))
          let data = {
            transCode: this.intfId,
            flowCmpId: this.node.id,
            svcFlowCmpParams: JSON.stringify(cmpParams)
          }
          saveSvcFlowCmpParams(data).then(response => {
            console.log("response999:", response)
            eventBus.$emit("")
            this.msgSuccess("保存成功")
          })
        },
        // 从前台缓存获取节点组件参数
        getParamsFromCache(nodeData, nodeclass) {
          let self = this
          self.formData = self.nodeParams.save[nodeData.id].cmpParams
          if (nodeclass === 'customComponent' && this.nodeParams.save[nodeData.id].customBeanNameVal) {
            this.$set(self.formData.base[0], 'paramValue', self.nodeParams.save[nodeData.id].customBeanNameVal)
          }
        },
        // 从后台获取节点组件参数
        getNodeParams(nodeData, nodeclass) {
          this.formModel = {};
          const req = {
            transCode: this.intfId,
            flowCmpId: nodeData.id
          }
          //获取交易流程组件基本参数
          searchSvcFlowCmpParams(req).then(response => {
            this.formData = {
              base: [],
              input: [],
              output: []
            }
            let formDataList = []
            formDataList = response.data;
            console.log("data0000", formDataList)
            if (formDataList.length === 0) {
              const reqData = {
                flowTplPk: this.ProjectData.id,
                flowTplCmpId: nodeData.id
              }
              // 获取流程模板组件参数
              getFlowTplCmpParams(reqData).then(response => {
                formDataList = response.data
                console.log("data11111", formDataList)
                if (formDataList.length === 0) {
                  const beanName = nodeData.beanName
                  // 获取组件参数
                  searchCmpParams(beanName).then(response => {
                    formDataList = response.data
                    console.log("data22222", formDataList)
                    for (let i in formDataList) {
                      if (formDataList[i].paramTypeCd === '01') {
                        this.formData.input.push(formDataList[i])
                      } else if (formDataList[i].paramTypeCd === '02') {
                        this.formData.output.push(formDataList[i])
                      } else if (formDataList[i].paramTypeCd === '03') {
                        this.formData.base.push(formDataList[i])
                      }
                    }
                    eventBus.$emit("svcnodeParamsSync", { target: {del : 'save', id : nodeData.id, data : this.formData} })
                  }).then(() => {
                    if (nodeclass === 'subcmp') {
                      let subFlowPk = null
                      for (let item of this.subFlowList) {
                        if (nodeData.beanName === item.beanName) {
                          subFlowPk = item.subFlowTplPk
                        }
                      }
                      console.log("subflowpk", subFlowPk, this.formData)
                      this.$set(this.formData.base[0], "paramValue", subFlowPk)
                      eventBus.$emit("svcnodeParamsSync", { target: {del : 'save', id : nodeData.id, data : this.formData} })
                      eventBus.$emit("transSubFlowPk", { target: subFlowPk })
                    }
                  })
                } else {
                  for (let i in formDataList) {
                    if (formDataList[i].paramTypeCd === '01') {
                      this.formData.input.push(formDataList[i])
                    } else if (formDataList[i].paramTypeCd === '02') {
                      this.formData.output.push(formDataList[i])
                    } else if (formDataList[i].paramTypeCd === '03') {
                      this.formData.base.push(formDataList[i])
                    }
                  }
                  console.log("1111111", nodeData.id, this.formData)
                  eventBus.$emit("svcnodeParamsSync", { target: {del : 'save', id : nodeData.id, data : this.formData} })
                  console.log("nodeParams11111", this.nodeParams)
                }
              }).then(() =>{
                if (nodeclass === 'subcmp') {
                  let subFlowPk = null
                  for (let item of this.subFlowList) {
                    if (nodeData.beanName === item.beanName) {
                      subFlowPk = item.subFlowTplPk
                    }
                  }
                  console.log("subflowpk", subFlowPk, this.formData)
                  eventBus.$emit("svcnodeParamsSync", { target: {del : 'save', id : nodeData.id, data : this.formData} })
                  eventBus.$emit("transSubFlowPk", { target: subFlowPk })
                }
              })
            } else {
              for (let i in formDataList) {
                if (formDataList[i].paramTypeCd === '01') {
                  this.formData.input.push(formDataList[i])
                } else if (formDataList[i].paramTypeCd === '02') {
                  this.formData.output.push(formDataList[i])
                } else if (formDataList[i].paramTypeCd === '03') {
                  this.formData.base.push(formDataList[i])
                }
              }
              eventBus.$emit("svcnodeParamsSync", { target: {del : 'save', id : nodeData.id, data : this.formData} })
              if (nodeclass === 'subcmp') {
                let subFlowPk = null
                for (let item of this.subFlowList) {
                  if (nodeData.beanName === item.beanName) {
                    subFlowPk = item.subFlowTplPk
                  }
                }
                console.log("subflowpk", subFlowPk , this.formData)
                this.$set(this.formData.base[0], "paramValue", subFlowPk)
                eventBus.$emit("svcnodeParamsSync", { target: {del : 'save', id : nodeData.id, data : this.formData} })
                eventBus.$emit("transSubFlowPk", { target: subFlowPk })
              }
            }
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
        // handleEdgeChange(edge) {
        //   const model = {
        //     label: edge.label,
        //     condition: edge.condition,
        //     textColor: edge.textColor,
        //     flag: edge.flag
        //   };
        //   this.graph.update(this.item, model);
        // },
        handleEdgeSubmit() {

        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        openBndDia() {
          this.fullscreenLoading = true;
          if (this.$refs.bndDia) {
            this.$nextTick(() => {
              this.bndDiaVis = true
              this.$refs.bndDia.openBndListDia()
            })
          }
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 2000)
        },
        getDataFromDia(data) {
          console.log("input", this.formData.input)
          this.formData.input.forEach((item, index)=> {
            if (item.paramVar === 'ComponentTransport_comp_id') {
              this.$nextTick(() => {
                let paramValue = data.compId
                this.$set(this.formData.input[index], "paramValue", paramValue)
              })
            } else if (item. paramVar === 'ComponentTransport_ctx_type') {
              this.$nextTick(() => {
                let paramValue = data.ctxDesc
                this.$set(this.formData.input[index], "paramValue", paramValue)
              })
            }
          })
        },
        getSubFlowList() {
          eventBus.$on("selectSubCmp", subFlowCmp => {
            this.subFlowList = subFlowCmp
          })
        },
        // 更新缓存
        updateNodeParams() {
          eventBus.$on("svcnodeParamsSync", target => {
            console.log("走这里啦888", target)
            const params = target.target
            if (params.del === 'del') {
              this.nodeParams.del[params.id] = this.nodeParams.save[params.id]
              delete this.nodeParams.save[params.id]
              return
            }
            if (params.del === 'save') {
              this.nodeParams.save[params.id] = {}
              this.nodeParams.save[params.id]['cmpParams'] = params.data
              console.log("qyshbvgvgdw", this.nodeParams)
            }
          })
        },
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
