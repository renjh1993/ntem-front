<template>
    <div class="detailpannel">
        <el-scrollbar wrap-class="scrollbar-wrapper" style="height: 100%">
            <div v-if="status=='node-selected'" class="pannel" id="node_detailpannel">
                <div class="pannel-title">模型详情</div>
                <el-tabs ref="tabs" v-model="activeName" type="card" @tab-click="handleTabClick">
                    <el-tab-pane label="基本属性" name="base">
                        <el-form :model="node" label-position="left" size="mini">
                          <el-form-item label="nodeId:" label-width="80px">
                            <el-input v-model="node.id" :disabled="true"></el-input>
                          </el-form-item>
                          <el-form-item label="组件名:" label-width="60px" >
                            <el-input v-model="node.label" :disabled="true"></el-input>
                          </el-form-item>
                          <el-form-item label="beanName:" label-width="80px">
                            <el-input v-model="node.beanName" :disabled="true" type="textarea"></el-input>
                          </el-form-item>
                        </el-form>
                        <el-form :model="formData" ref="'nodeForm_base" label-position="left">
                            <el-form-item :label="item.paramVarName + ':'" v-for="(item,index) in (formData.base)" :key="index">
                                <el-select @blur="item_blur()" clearable v-if="item.showType === '2'" v-model="formData.base[index].paramValue">
                                  <el-option v-for="(secItem, secindex) in (JSON.parse(item.showValue))" :key="secItem.value" :label="secItem.label" :value="secItem.value"/>
                                </el-select>
                                <el-input v-else v-model="formData.base[index].paramValue"
                                    @blur="item_blur()" @keydown.delete.native.stop=""
                                    :disabled="formData.base[index].isDefault==='1' || node.nodeType ==='subcmp'"
                                >
                                    <i slot="suffix" class="el-input__icon" v-model="item.isDefault"
                                            @click="isDefaultBase(index)"
                                            :class="[formData.base[index].isDefault==='1' ? 'el-icon-lock' : 'el-icon-unlock']"></i>
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
                                <el-select @blur="item_blur()" clearable v-if="item.showType === '2'" v-model="formData.input[index].paramValue">
                                  <el-option v-for="(secItem, secindex) in (JSON.parse(item.showValue))" :key="secItem.value" :label="secItem.label" :value="secItem.value"/>
                                </el-select>
                                <el-input v-else v-model="formData.input[index].paramValue" :disabled="node.beanName ==='componentTransport' || formData.input[index].isDefault==='1'"
                                          @blur="item_blur()" @keydown.delete.native.stop="">
                                  <i slot="suffix" class="el-input__icon" v-show="node.beanName !=='componentTransport'" v-model="item.isDefault"
                                     @click="isDefaultInput(index)"
                                     :class="[formData.input[index].isDefault==='1' ? 'el-icon-lock' : 'el-icon-unlock']"></i>
                                </el-input>
                            </el-form-item>
                        </el-form>
                        <div class="no-params" v-if="formData.input.length==0">暂未配置参数</div>
                    </el-tab-pane>
                    <el-tab-pane label="出参" name="output">
                        <el-form :model="formData" ref="nodeForm_output" label-position="left">
                            <el-form-item :label="item.paramVarName + ':'" v-for="(item,index) in (formData.output)"
                                :key="index">
                                <el-select @blur="item_blur()" clearable v-if="item.showType === '2'" v-model="formData.output[index].paramValue">
                                  <el-option v-for="(secItem, secindex) in (JSON.parse(item.showValue))" :key="secItem.value" :label="secItem.label" :value="secItem.value"/>
                                </el-select>
                                <el-input v-else v-model="item.paramValue"
                                    @blur="item_blur()" @keydown.delete.native.stop=""
                                    :disabled="formData.output[index].isDefault==='1'">
                                    <i slot="suffix" class="el-input__icon" v-model="item.isDefault"
                                        @click="isDefaultOutput(index)"
                                        :class="[formData.output[index].isDefault==='1' ? 'el-icon-lock' : 'el-icon-unlock']"></i>
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
                          <el-select v-model="edge.flag" @change=handleEdgeChange(edge)
                            placeholder="请选择">
                              <el-option label="表达式" value="0"></el-option>
                              <el-option label="函数" value="1"></el-option>
                          </el-select>
                        </el-col>
                    </el-row>
                    <el-row style="margin-bottom: 25px" :gutter="10">
                      <el-col :span="6"></el-col>
                      <el-col :span="18">
                        <el-input style="height: 100%" type="textarea" placeholder="请输入函数或表达式" v-model="edge.condition" class="input-with-select"
                                  @change="handleEdgeChange(edge)" @keydown.delete.native.stop="">
                        </el-input>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="6">颜色</el-col>
                        <el-col :span="18">
                            <el-input v-model="edge.textColor" @change="handleEdgeChange(edge)"
                                @keydown.delete.native.stop="" />
                        </el-col>
                    </el-row>
                    <el-row :gutter="10" v-show="showEdgeInfo">
                      <el-col :span="8">是否异步</el-col>
                      <el-col :span="16">
                        <el-radio-group v-model="edge.async" @change.native="handleEdgeChange(edge)">
                          <el-radio :label="'true'">是</el-radio>
                          <el-radio :label="'false'">否</el-radio>
                        </el-radio-group>
                      </el-col>
                    </el-row>
                </div>
                <div class="submit-button">
                    <el-button icon="el-icon-close" @click="resetForm">重置</el-button>
                    <el-button type="primary" icon="el-icon-check" @click.prevent="handleEdgeSubmit">保存</el-button>
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
                            <el-input v-model="flowType" disabled @change="handleProjectChange"
                                @keydown.delete.native.stop="" />
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="6">描述</el-col>
                        <el-col :span="18">
                            <el-input v-model="ProjectData.subFlowTplPk" disabled @change="handleProjectChange"
                                @keydown.delete.native.stop="" />
                        </el-col>
                    </el-row>
<!--                  <el-row v-if="node.nodeType === 'subcmp'" :gutter="10">-->
<!--                    <el-col :span="8">subProcessPk</el-col>-->
<!--                    <el-col :span="16">-->
<!--                      <el-input v-model="ProjectData.describe" disabled @change="handleProjectChange"-->
<!--                                @keydown.delete.native.stop="" />-->
<!--                    </el-col>-->
<!--                  </el-row>-->
                    <el-row :gutter="10">
                        <el-col :span="8">网格对齐</el-col>
                        <el-col :span="16">
                            <el-checkbox v-model="showGrid" @change="changeGridState"></el-checkbox>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10" v-if="this.ProjectData.type === '03'">
<!--                      <el-col :span="8">子流程组件参数</el-col>-->
                      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="openParamDia()">新增子流程组件参数</el-button>
                    </el-row>
                </div>
            </div>
            <div v-if="this.ProjectData.type === '03'">
              <div class="pannel-title">子流程组件参数详情</div>
              <el-tabs ref="tabs" v-model="tabName" type="card" @tab-click="handleSubTabClick">
                <el-tab-pane label="基本属性" name="base">
                  <el-form :model="subNode" label-position="left" size="mini">
<!--                    <el-form-item label="nodeId:" label-width="80px">-->
<!--                      <el-input v-model="subNode.id" :disabled="true"></el-input>-->
<!--                    </el-form-item>-->
                    <el-form-item label="组件名:" label-width="60px" >
                      <el-input v-model="subNode.sdesc" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="beanName:" label-width="80px">
                      <el-input v-model="subNode.beanName" :disabled="true" type="textarea"></el-input>
                    </el-form-item>
                  </el-form>
                  <el-form :model="subFormData" ref="'nodeForm_base" label-position="left">
                    <el-form-item :label="item.paramVarName + ':'" v-for="(item,index) in (subFormData.base)" :key="index">
                      <el-select v-if="item.showType === '2'" v-model="subFormData.base[index].paramValue">
                        <el-option v-for="(secItem, secindex) in (JSON.parse(item.showValue))" :key="secItem.value" :label="secItem.label" :value="secItem.value"/>
                      </el-select>
                      <el-input v-else v-model="item.paramValue" :disabled="subFormData.base[index].isDefault==='1'"
                      >
                        <i slot="suffix" class="el-input__icon" v-model="item.isDefault"
                           @click="isDefaultSubBase(index)"
                           :class="[subFormData.base[index].isDefault==='1' ? 'el-icon-lock' : 'el-icon-unlock']"></i>
                      </el-input>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="入参" name="input">
                  <el-form :model="subFormData" ref="nodeForm_input" label-position="left">
                    <el-form-item :label="item.paramVarName + ':'" v-for="(item, index) in (subFormData.input)"
                                  :key="index">
                      <el-select v-if="item.showType === '2'" v-model="subFormData.input[index].paramValue">
                        <el-option v-for="(secItem, secindex) in (JSON.parse(item.showValue))" :key="secItem.value" :label="secItem.label" :value="secItem.value"/>
                      </el-select>
                      <el-input v-else v-model="subFormData.input[index].paramValue" :disabled="subFormData.input[index].isDefault==='1'">
                        <i slot="suffix" class="el-input__icon" v-model="item.isDefault"
                           @click="isDefaultSubInput(index)"
                           :class="[subFormData.input[index].isDefault==='1' ? 'el-icon-lock' : 'el-icon-unlock']"></i>
                      </el-input>
                    </el-form-item>
                  </el-form>
                  <div class="no-params" v-if="subFormData.input.length==0">暂未配置参数</div>
                </el-tab-pane>
                <el-tab-pane label="出参" name="output">
                  <el-form :model="subFormData" ref="nodeForm_output" label-position="left">
                    <el-form-item :label="item.paramVarName + ':'" v-for="(item,index) in (subFormData.output)"
                                  :key="index">
                      <el-select v-if="item.showType === '2'" v-model="subFormData.output[index].paramValue">
                        <el-option v-for="(secItem, secindex) in (JSON.parse(item.showValue))" :key="secItem.value" :label="secItem.label" :value="secItem.value"/>
                      </el-select>
                      <el-input v-else v-model="item.paramValue" :disabled="subFormData.output[index].isDefault==='1'">
                        <i slot="suffix" class="el-input__icon" v-model="item.isDefault"
                           @click="isDefaultSubOutput(index)"
                           :class="[subFormData.output[index].isDefault==='1' ? 'el-icon-lock' : 'el-icon-unlock']"></i>
                      </el-input>
                    </el-form-item>
                  </el-form>
                  <div class="no-params" v-if="Object.keys(subFormData.output).length==0">暂未配置参数</div>
                </el-tab-pane>
              </el-tabs>
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
        <bnd-dia v-show="bndDiaVis" ref="bndDia" @rowData="getDataFromDia" />
<!--        <sub-flow-param v-show="paramDiaVis" ref="paramDia" :subCmpPk="fSubCmpPk" />-->
        <sub-flow-param v-show="paramDiaVis" ref="paramDia" />
    </div>
</template>

<script>
    import BndDia from "./bndDia"
    import SubFlowParam from './subFlowParam'
    import eventBus from "@/utils/flow/eventBus";
    import {Grid} from "@antv/g6";
    import {
        getFlowTplCmpParams,
        searchCmpParams,
    } from '@/api/flow/menu';
    import { getCmpPk, getCmpDef } from "@/api/flow/cmpDef"
    import{ saveFlowTpl, saveFlowTplCmpParams } from '@/api/flow/flow'
    import item from '../ItemPanel/item'
    import { deepClone } from '../../../utils'
    export default {
      components: { BndDia, SubFlowParam },
      data() {
        return {
          status: "canvas-selected",
          showGrid: false,
          disableList: 'label, type, x, y, id',
          page: {},
          graph: {},
          item: {},
          node: {},
          edge: {
            async: 'false'
          },
          textColor: 'rgba(19, 206, 102, 0.8)',
          grid: null,
          formData: {
            base: [],
            input: [],
            output: []
          },
          activeName: 'base',
          tabName: 'base',
          submitBtnVisible: false,
          ProjectData: {
            'name': '',
            'id': '',
            'describe': '',
            'type': '',
            'subFlowTplPk': '',
            'nodes': [],
            'edges': []
          },
          fullscreenLoading: false,
          bndDiaVis: false,
          subFlowList: [],
          paramDiaVis: false,
          // 子流程组件pk
          fSubCmpPk: null,
          customBeanNameVal: null,
          showEdgeInfo: false,
          nodeParams: {
            save: {},
            del: {}
          },
          subNode: {},
          subFormData: {
            base: [],
            input: [],
            output: []
          },
          customBeanNames: {},
        };
      },
      created() {
        this.init();
        this.bindEvent();
        this.getSubFlowList();
        this.updateNodeParams();
      },
      computed: {
        "flowType"() {
          if (this.ProjectData.type === '01') {
            return '流程模板'
          }  else if (this.ProjectData.type === '02') {
            return  '交易流程'
          } else if (this.ProjectData.type === '03') {
            return '子流程'
          }
        }
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
              self.ProjectData = item.target || item
              self.status = "canvas-selected";
              self.item = null;
              self.node = null;
            });
            eventBus.$on("observer-flow", item => {
              this.init()
              self.status = "canvas-selected";
              this.ProjectData.name = item.tplName
              this.ProjectData.id = item.flowTplPk
              this.ProjectData.type = item.tplType
              this.ProjectData.describe = item.sdesc
              if (this.ProjectData.type === '03') {
                this.getSubCmp()
              }
            })
            eventBus.$on("putCustomBeanName", item =>{
              this.nodeParams.save[item.target.nodeId]['customBeanNameVal'] = item.target.beanName
              this.customBeanNames[item.target.nodeId] = item.target.beanName
            })
            eventBus.$on("ctnodeselectDblclick", () => {
              let compIdItem = this.formData.input.filter(function(item) {
                return item.paramVar === 'ComponentTransport_comp_id'
              })
              let ctxItem = this.formData.input.filter(function(item) {
                return item.paramVar === 'ComponentTransport_ctx_type'
              })
              let selectTerm = {
                compId: compIdItem[0].paramValue,
                ctxType: ctxItem[0].paramValue
              }
              this.openBndDia(selectTerm)
            })
            eventBus.$on("saveFlow", () => {
              this.handleNodeSubmit()
            })
            eventBus.$on("deleteItem", () => {
              if (this.node){
                eventBus.$emit("nodeParamsSync", {target : {del: 'del', id: this.node.id}})
              }
              self.status = "canvas-selected"
            })
            eventBus.$on("toolDeleteItem", () => {
              self.status = "canvas-selected"
            })
            eventBus.$on("addForkEdge", item => {
              self.item = item.target
              self.edge = item.target.getModel()
              this.$set(self.edge, 'async', 'false')
              const model = {
                label: self.edge.label,
                condition: self.edge.condition,
                textColor: self.edge.textColor,
                flag: self.edge.flag,
                async: self.edge.async
              };
              this.graph.update(self.item, model);
              Object.assign(this.ProjectData, this.graph.save())
            })
          });
        },
        item_blur() {
          let self = this
          self.nodeParams.save[self.node.id].cmpParams = self.formData
          if (self.node.nodeType === 'customComponent') {
            if (self.nodeParams.save[self.node.id].customBeanNameVal) {
              self.nodeParams.save[self.node.id].customBeanNameVal = self.formData.base[0].paramValue
              // this.customBeanNames[self.node.id] = self.formData.base[0].paramValue
              // self.nodeParams.save[self.node.id].customBeanNameVal = ''
              if (this.customBeanNames[self.node.id] !== self.formData.base[0].paramValue) {
                eventBus.$emit("changeCustomLabel", {node: self.node, value: self.formData.base[0].paramValue})
                this.customBeanNames[self.node.id] = self.formData.base[0].paramValue
              }
            } else {
              if (this.customBeanNames[self.node.id] !== self.formData.base[0].paramValue) {
                eventBus.$emit("changeCustomLabel", {node: self.node, value: self.formData.base[0].paramValue})
                this.customBeanNames[self.node.id] = self.formData.base[0].paramValue
              }
            }
          }
          eventBus.$emit("modifyIsNotSave")
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
        handleSubTabClick() {

        },
        // 保存流程以及流程组件参数
        handleNodeSubmit() {
          let InfoData = Object.assign(this.ProjectData, this.graph.save());
          let result = this.checkSE(InfoData.nodes)
          if (result) {
            saveFlowTpl(InfoData).then(response => {
              console.log("3ui2eiy23", response)
              for (let key in this.nodeParams.save) {
                console.log("key", key)
                let cmpParams = this.nodeParams.save[key].cmpParams.input.concat(this.nodeParams.save[key].cmpParams.output.concat(this.nodeParams.save[key].cmpParams.base))
                console.log("cmpParams", cmpParams)
                let data = {
                  flowTplPk: this.ProjectData.id,
                  flowTplCmpId: key,
                  // params: (this.formData.base.concat(this.formData.input.concat(this.formData.output))).toString()
                  cmpParams: JSON.stringify(cmpParams)
                }
                console.log("data", data)
                saveFlowTplCmpParams(data)
              }
              this.msgSuccess("保存成功")
              eventBus.$emit("modifyIsSave")
            })
          } else {
            this.msgError("保存失败:请先添加流程开始或结束节点")
          }
        },
        // 从前台缓存获取节点参数
        getParamsFromCache(nodeData, nodeclass) {
          let self = this
          self.formData = self.nodeParams.save[nodeData.id].cmpParams
          if (nodeclass === 'customComponent' && this.nodeParams.save[nodeData.id].customBeanNameVal) {
            this.$set(self.formData.base[0], "paramValue", self.nodeParams.save[nodeData.id].customBeanNameVal)
          }
        },
        //从后台获取节点基本参数
        getNodeParams(nodeData, nodeclass) {
          // console.log(6666, nodeData, this.ProjectData)
          let self = this
          this.formModel = {};
          const req = {
            // type: nodeclass
            flowTplPk: this.ProjectData.id,
            flowTplCmpId: nodeData.id
          }
          //从流程组件获取节点基本参数
          getFlowTplCmpParams(req).then(response => {
            this.formData = {
              base: [],
              input: [],
              output: []
            }
            let formDataList = []
            formDataList = response.data;
            if (formDataList.length === 0) {
              const beanName = nodeData.beanName
              // 从组件获取参数
              searchCmpParams(beanName).then(response => {
                formDataList = response.data
                for (let i in formDataList) {
                  formDataList[i].isDefault = '0'
                  if (formDataList[i].paramTypeCd === '01') {
                    this.formData.input.push(formDataList[i])
                  } else if (formDataList[i].paramTypeCd === '02') {
                    this.formData.output.push(formDataList[i])
                  } else if (formDataList[i].paramTypeCd === '03') {
                    this.formData.base.push(formDataList[i])
                  }
                }
                eventBus.$emit("nodeParamsSync", { target: {del : 'save', id : nodeData.id, data : this.formData} })
              }).then(() => {
                if (nodeclass === 'subcmp') {
                  let subFlowPk = null
                  console.log("nodeData:", nodeData, nodeclass, this.subFlowList)
                  for (let item of this.subFlowList) {
                    if (nodeData.beanName ===  item.beanName) {
                      subFlowPk = item.subFlowTplPk
                    }
                  }
                  this.$set(this.formData.base[0], "paramValue", subFlowPk)
                  eventBus.$emit("transSubFlowPk", { target: subFlowPk })
                }
                else if (nodeclass === 'customComponent') {
                  if (this.nodeParams.save[nodeData.id].customBeanNameVal) {
                    this.$set(this.formData.base[0], "paramValue", this.nodeParams.save[nodeData.id].customBeanNameVal)
                    this.customBeanNames[nodeData.id] = this.formData.base[0].paramValue
                  } else {
                    this.$set(this.formData.base[0], "paramValue", "MyComponent")
                    this.customBeanNames[nodeData.id] = this.formData.base[0].paramValue
                    eventBus.$emit("nodeParamsSync", { target: {del : 'save', id : nodeData.id, data : this.formData} })
                  }
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
              eventBus.$emit("nodeParamsSync", { target: {del : 'save', id : nodeData.id, data : this.formData} })
              if (nodeclass === 'subcmp') {
                let subFlowPk = null
                for (let item of this.subFlowList) {
                  if (nodeData.beanName = item.beanName) {
                    subFlowPk = item.subFlowTplPk
                  }
                }
                this.$set(this.formData.base[0], "paramValue", subFlowPk)
                eventBus.$emit("transSubFlowPk", { target: subFlowPk })
              }
              else if (nodeclass === 'customComponent') {
                if (this.nodeParams.save[nodeData.id].customBeanNameVal) {
                  this.$set(this.formData.base[0], "paramValue", this.nodeParams.save[nodeData.id].customBeanNameVal)
                  this.customBeanNames[nodeData.id] = this.formData.base[0].paramValue
                } else {
                  this.customBeanNames[nodeData.id] = this.formData.base[0].paramValue
                }
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
        handleEdgeChange(edge) {
          const model = {
            label: edge.label,
            condition: edge.condition,
            textColor: edge.textColor,
            flag: edge.flag,
            async: edge.async
          };
          this.graph.update(this.item, model);
        },
        handleEdgeSubmit() {
          let self = this
          self.InfoData = Object.assign(self.ProjectData, self.graph.save());
          let result = this.checkSE(this.InfoData.nodes)
          if(self.InfoData.id){
            if(result) {
              saveFlowTpl(this.InfoData).then(response =>{
                this.msgSuccess("保存成功")
                console.log("保存之后", self.InfoData)
                // eventBus.$emit("projectChange", {target: self.InfoData })
              })
            } else {
              this.msgError("保存失败:请先添加流程开始或结束节点")
            }
            this.modifyIsSave = true;
          }else {
            this.msgError("保存失败:尚未添加流程")
          }
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        checkSE(arr) {
          for (let item of arr) {
            if (item.nodeType === "start") {
              for (let item of arr) {
                if (item.nodeType === "end") {
                  return true
                }
              }
            }
          }
        },
        openBndDia(data) {
          this.fullscreenLoading = true;
          if (this.$refs.bndDia) {
            this.$nextTick(() => {
              this.bndDiaVis = true
              this.$refs.bndDia.openBndListDia(data)
            })
          }
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 2000)
        },
        getDataFromDia(data) {
          this.formData.input.forEach((item, index)=> {
            if (item.paramVar === 'ComponentTransport_comp_id') {
              this.$nextTick(() => {
                let paramValue = data.compId
                this.$set(this.formData.input[index], "paramValue", paramValue)
              })
            } else if (item.paramVar === 'ComponentTransport_ctx_type') {
              this.$nextTick(() => {
                let paramValue = data.ctxDesc
                this.$set(this.formData.input[index], "paramValue", paramValue)
              })
            }
          })
        },
        isDefaultInput(index) {
          // this.formData.input[index].isDefault==='0' ? this.formData.input[index].isDefault='1' : this.formData.input[index].isDefault='0'
          let isDefault = this.formData.input[index].isDefault==='0' ? '1' : '0'
          this.$set(this.formData.input[index], "isDefault", isDefault)
        },
        isDefaultBase(index) {
          let isDefault = this.formData.base[index].isDefault==='0' ? '1' : '0'
          this.$set(this.formData.base[index], "isDefault", isDefault)
        },
        isDefaultOutput(index) {
          let isDefault = this.formData.output[index].isDefault==='0' ? '1' : '0'
          this.$set(this.formData.output[index], "isDefault", isDefault)
        },
        getSubFlowList() {
          eventBus.$on("selectSubCmp", subFlowCmp => {
            this.subFlowList = subFlowCmp
          })
        },
        openParamDia() {
          let self = this
          getCmpPk(this.ProjectData.id).then(response => {
            self.fSubCmpPk = response.data
            eventBus.$emit('getSubCmpPk',  {target: self.fSubCmpPk})
          })
          this.fullscreenLoading = true;
          this.$nextTick(() => {
              this.paramDiaVis = true
              this.$refs.paramDia.openDia()
            })
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 2000)
        },
        updateNodeParams() {
          eventBus.$on("nodeParamsSync", target => {
            const params = target.target
            if (params.del === 'del') {
              this.nodeParams.del[params.id] = this.nodeParams.save[params.id]
              delete this.nodeParams.save[params.id]
              return
            }
            if (params.del === 'save') {
              this.nodeParams.save[params.id] = {}
              this.nodeParams.save[params.id]['cmpParams'] = params.data
            }
          })
        },
        // 获取子流程组件详情
        getSubCmp() {
          let self = this
          getCmpPk(self.ProjectData.id).then(response => {
            self.fSubCmpPk = response.data
            getCmpDef(self.fSubCmpPk).then(response => {
              self.subNode = response.data
            }).then(() => {
              self.getSubCmpParams()
            })
          })
        },
        getSubCmpParams() {
          let self = this
          let subBeanName = self.subNode.beanName
          searchCmpParams(subBeanName).then(response => {
            let formDataList = []
            formDataList = response.data
            self.subFormData = {
              base: [],
              input: [],
              output: []
            }
            for (let i in formDataList) {
              formDataList[i].isDefault = '0'
              if (formDataList[i].paramTypeCd === '01') {
                this.subFormData.input.push(formDataList[i])
              } else if (formDataList[i].paramTypeCd === '02') {
                this.subFormData.output.push(formDataList[i])
              } else if (formDataList[i].paramTypeCd === '03') {
                this.subFormData.base.push(formDataList[i])
              }
            }
            let subFlowPk = null
            for (let item of this.subFlowList) {
              if (subBeanName === item.beanName) {
                subFlowPk = item.subFlowTplPk
              }
            }
            this.$set(this.subFormData.base[0], "paramValue", subFlowPk)
          })
        },
        isDefaultSubInput(index) {
          // this.formData.input[index].isDefault==='0' ? this.formData.input[index].isDefault='1' : this.formData.input[index].isDefault='0'
          let isDefault = this.subFormData.input[index].isDefault==='0' ? '1' : '0'
          this.$set(this.subFormData.input[index], "isDefault", isDefault)
        },
        isDefaultSubBase(index) {
          let isDefault = this.subFormData.base[index].isDefault==='0' ? '1' : '0'
          this.$set(this.subFormData.base[index], "isDefault", isDefault)
        },
        isDefaultSubOutput(index) {
          let isDefault = this.subFormData.output[index].isDefault==='0' ? '1' : '0'
          this.$set(this.subFormData.output[index], "isDefault", isDefault)
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
    .el-select .el-input {
      width: 130px;
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
</style>
