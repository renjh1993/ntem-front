<template>
  <div class="toolarea">
    <div class="toolbar">
      <i
        class="command iconfont icon-new"
        title="新建"
        @click="handleNewProject"
      ></i>
<!--      <i-->
<!--        class="command iconfont icon-baocun"-->
<!--        title="保存(禁用)"-->
<!--        v-if="saveDisable"-->
<!--      ></i>-->
      <i
        class="command iconfont icon-baocun"
        title="保存"
        @click="handleSave"
      ></i>
      <i
        class="command iconfont icon-history"
        title="历史数据"
        @click="readHistoryData"
        v-loading.fullscreen.lock="fullscreenLoading"
      ></i>
      <i
        class="command iconfont icon-undo"
        title="撤销"
        :class="undoList.length>0?'':'disable'"
        @click="handleUndo"
      ></i>
      <i
        class="command iconfont icon-redo"
        title="重做"
        :class="redoList.length>0?'':'disable'"
        @click="handleRedo"
      ></i>
      <span class="separator"></span>
      <i
        data-command="copy"
        class="command iconfont icon-copy"
        title="复制"
        @click="handleCopy"
        ></i>
      <i
        data-command="paste"
        class="command iconfont icon-paste"
        title="粘贴"
        :class="copyData.length>0?'':'disable'"
        @click="handlePaste"
      ></i>
      <i
        data-command="delete"
        class="command iconfont icon-delete"
        title="删除"
        :class="selectedItem?'':'disable'"
        @click="handleDelete"
      ></i>
      <span class="separator"></span>
      <i
        data-command="zoomIn"
        class="command iconfont icon-zoom-in"
        title="放大"
        @click="handleZoomIn"
      ></i>
      <i
        data-command="zoomOut"
        class="command iconfont icon-zoom-out"
        title="缩小"
        @click="handleZoomOut"
      ></i>
      <i
        data-command="autoZoom"
        class="command iconfont icon-fit-canvas"
        title="适应画布"
        @click="handleAutoZoom"
      ></i>
      <i
        data-command="resetZoom"
        class="command iconfont icon-actual-size"
        title="实际尺寸"
        @click="handleResetZoom"
      ></i>
      <span class="separator"></span>
      <i
        data-command="toBack"
        class="command iconfont icon-to-back"
        :class="selectedItem?'':'disable'"
        title="层级后置"
        @click="handleToBack"
      ></i>
      <i
        data-command="toFront"
        class="command iconfont icon-to-front"
        :class="selectedItem?'':'disable'"
        title="层级前置"
        @click="handleToFront"
      ></i>
      <span class="separator"></span>
      <span class="separator"></span>
      <i
        data-command="multiSelect"
        class="command iconfont icon-multiselect"
        :class="multiSelect?'disable':''"
        title="多选"
        @click="handleMuiltSelect"
      ></i>
      <i
        data-command="addGroup"
        class="command iconfont icon-group"
        title="成组"
        :class="addGroup?'':'disable'"
        @click="handleAddGroup"
      ></i>
      <i
        data-command="unGroup"
        class="command iconfont icon-ungroup disable"
        title="解组"
      ></i>
      <i
        class="command iconfont icon-preview"
        title="预览"
        @click="previewData"
      ></i>
      <span class="extra-item" v-if="ProjectData.id!=''">ID:{{ProjectData.id}}</span>
      <span class="extra-item" v-if="ProjectData.name!=''">名称:{{ProjectData.name}}</span>
      <span v-if="!modifyIsSave" class="modify-save">未保存</span>
      <preview-info v-if="InfoVisible" ref="CanvasInfo" :data="InfoData"></preview-info>
      <flow-create v-if="createVisible" @flowNew="flowNew" ref="createFlow"></flow-create>
      <his-flow v-if="hisVisible" ref="hisFlow" @observer-flow="flowNew"></his-flow>
    </div>
  </div>
</template>

<script>
    import eventBus from "@/utils/flow/eventBus";
    import Util from "@antv/g6/src/util";
    import {
        uniqueId,
        getBox
    } from "@/utils";
    import previewInfo from './previewInfo'
    import flowCreate from './NewFlow'
    import hisFlow   from './hisFlow'
    import { saveFlowTpl, getFlowList } from '@/api/flow/flow'
    export default {
        data() {
            return {
                page: {},
                graph: {},
                modifyIsSave: true,
                copyData: [],
                redoList: [],
                undoList: [],
                editor: null,
                command: null,
                selectedItem: null,
                multiSelect: false,
                addGroup: false,
                InfoVisible: false,
                InfoData: {},
                createVisible: false,
                flowInitData: {
                    'name': '',
                    'id': '',
                    'nodes': [],
                    'edges': []
                },
                ProjectData: {
                    'name': '',
                    'id': '',
                    'nodes': [],
                    'edges': []
                },
                hisVisible: false,
                hisData: [],
                // saveDisable: true
                fullscreenLoading: false
            };
        },
        components: {
            previewInfo,
            flowCreate,
            hisFlow
        },
        created() {
            this.init();
            this.bindEvent();
        },
        watch: {
            selectedItem(val) {
                if (val && val.length > 1) {
                    this.addGroup = true;
                } else {
                    this.addGroup = false;
                }
            }
        },
        methods: {
            init() {
                const {
                    editor,
                    command
                } = this.$parent;
                this.editor = editor;
                this.command = command;
            },
            bindEvent() {
                let self = this;
                eventBus.$on("afterAddPage", page => {
                    self.page = page;
                    self.graph = self.page.graph;
                });
                eventBus.$on("add", data => {
                    this.redoList = data.redoList;
                    this.undoList = data.undoList;
                    this.modifyIsSave = false;
                });
                eventBus.$on("update", data => {
                    this.redoList = data.redoList;
                    this.undoList = data.undoList;
                    this.modifyIsSave = false;
                });
                eventBus.$on("delete", data => {
                    this.redoList = data.redoList;
                    this.undoList = data.undoList;
                    this.modifyIsSave = false;
                });
                eventBus.$on("updateItem", item => {
                    this.command.executeCommand("update", [item]);
                    this.modifyIsSave = false;
                });
                eventBus.$on("addItem", item => {
                    this.command.executeCommand("add", [item]);
                    this.modifyIsSave = false;
                });
                eventBus.$on("nodeselectchange", () => {
                    this.selectedItem = this.graph.findAllByState("node", "selected");
                    this.selectedItem = this.selectedItem.concat(
                        ...this.graph.findAllByState("edge", "selected")
                    );
                });
                eventBus.$on("deleteItem", () => {
                    this.handleDelete();
                    this.modifyIsSave = false;
                });
                eventBus.$on("muliteSelectEnd", () => {
                    this.multiSelect = false;
                    this.selectedItem = this.graph.findAllByState("node", "selected");
                });
                eventBus.$on("projectChange", item => {
                    this.InfoData = item
                    Object.assign(this.ProjectData, item);
                    this.modifyIsSave = false;
                });
                eventBus.$on("observer-flow", item => {
                  this.ProjectData.name = item.tplName
                  this.ProjectData.id = item.flowTplPk
                  this.modifyIsSave = true
                });
                eventBus.$on("copyItem", () => {
                    this.handleCopy();
                });
                eventBus.$on("pasteItem", () => {
                    this.handlePaste();
                });
                eventBus.$on("modifyIsNotSave", () => {
                  this.modifyIsSave = false
                })
                eventBus.$on("modifyIsSave", () => {
                  this.modifyIsSave = true
                })
                // eventBus.$on("putCustomCmpData", item => {
                //   console.log("itemitemitem", item)
                // })
            },
            handleUndo() {
                if (this.undoList.length > 0) this.command.undo();
            },
            handleRedo() {
                if (this.redoList.length > 0) this.command.redo();
            },
            handleDelete() {
                if (this.selectedItem.length > 0) {
                    this.command.executeCommand("delete", this.selectedItem);
                    this.selectedItem = null;
                    eventBus.$emit("toolDeleteItem")
                }
            },
            getFormatPadding() {
                return Util.formatPadding(this.graph.get("fitViewPadding"));
            },
            getViewCenter() {
                const padding = this.getFormatPadding();
                const graph = this.graph;
                const width = this.graph.get("width");
                const height = graph.get("height");
                return {
                    x: (width - padding[2] - padding[3]) / 2 + padding[3],
                    y: (height - padding[0] - padding[2]) / 2 + padding[0]
                };
            },
            handleZoomIn() {
                const currentZoom = this.graph.getZoom();
                this.graph.zoomTo(currentZoom + 0.5, this.getViewCenter());
            },
            handleZoomOut() {
                const currentZoom = this.graph.getZoom();
                this.graph.zoomTo(currentZoom - 0.5, this.getViewCenter());
            },
            handleToBack() {
                if (this.selectedItem && this.selectedItem.length > 0) {
                    this.selectedItem.forEach(item => {
                        item.toBack();
                        this.graph.paint();
                    });
                }
            },
            handleToFront() {
                if (this.selectedItem && this.selectedItem.length > 0) {
                    this.selectedItem.forEach(item => {
                        if (item.getType() === "edge") {
                            // const nodeGroup = this.graph.get("nodeGroup");
                            // const edgeGroup = item.get("group");
                            // nodeGroup.toFront();
                            // edgeGroup.toFront();
                        } else {
                            item.toFront();
                        }
                        this.graph.paint();
                    });
                }
            },
            handleAutoZoom() {
                this.graph.fitView(20);
            },
            handleResetZoom() {
                this.graph.zoomTo(1, this.getViewCenter());
            },
            handleMuiltSelect() {
                this.multiSelect = true;
                this.graph.setMode("mulitSelect");
            },
            handleAddGroup() {
                //TODO 这部分等阿里更新Group之后添加
                // const model = {
                //   id: "group" + uniqueId(),
                //   title: "新建分组"
                // };
                // // this.command.executeCommand("add", "group", model);
                // this.selectedItem.forEach(item => {
                //   console.log(item);
                // });

                //this.getPosition(this.selectedItem);
            },
            // 读取历史数据
            // readHistoryData() {
            //     let stringData = localStorage.getItem("flowData");
            //     if (stringData === "" || stringData === "{}" || stringData === null) {
            //         this.$message.warning("无历史数据");
            //         return;
            //     }
            //     let jsonData = JSON.parse(stringData);
            //     this.graph.read(jsonData);
            // },
            // readHistoryData() {
            //   getFlowList().then(response =>{
            //     console.log("response", response)
            //       this.hisData = Object.assign(response)
            //       this.hisVisible = true
            //       this.$nextTick(() => {
            //         this.$refs.hisFlow.init();
            //       })
            //       if (this.hisData === "" || this.hisData === "{}" || this.hisData === null) {
            //         this.$message.warning("无历史数据");
            //         return;
            //       }
            //   })
            // },
            readHistoryData() {
              this.fullscreenLoading = true;
              getFlowList().then(response =>{
                this.hisData = Object.assign(response)
                this.hisVisible = true
                this.$nextTick(() => {
                  this.$refs.hisFlow.init();
                })
                if (this.hisData === "" || this.hisData === "{}" || this.hisData === null) {
                  this.$message.warning("无历史数据");
                  return;
                }
                setTimeout(() => {
                  this.fullscreenLoading = false;
                }, 2000);
              })
            },
            // 保存
            handleSave() {
                eventBus.$emit("saveFlow")
                this.modifyIsSave = true;
            },
            // 新建时保存
            saveFlow() {
              console.log("graph:", this.graph)
              let self = this
              self.InfoData = Object.assign(self.ProjectData, self.graph.save());
              console.log("8899",self.InfoData)
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
            checkSE(arr) {
              for(let item of arr) {
                if (item.nodeType === "start") {
                  for(let item of arr) {
                    if(item.nodeType === "end"){
                      return true
                    }
                  }
                }
              }
            },
            // 复制
            handleCopy() {
                this.copyData = this.selectedItem ? this.selectedItem.filter(item => item.getType() === 'node') : []
                if (this.copyData && this.copyData.length > 0) {
                    this.command.copy(this.copyData);
                }
            },
            // 粘贴
            handlePaste() {
                if (this.copyData.length > 0)
                    this.command.paste();
            },
            getPosition(items) {
                const boxList = [];
                items.forEach(item => {
                    const box = item.getBBox();
                    boxList.push(getBox(box.x, box.y, box.width, box.height));
                });
                let minX1, minY1, MaxX2, MaxY2;
                boxList.forEach(box => {
                    if (typeof minX1 == "undefined") {
                        minX1 = box.x1;
                    }
                    if (typeof minY1 == "undefined") {
                        minY1 = box.y1;
                    }
                    if (typeof MaxX2 == "undefined") {
                        MaxX2 = box.x2;
                    }
                    if (typeof MaxY2 == "undefined") {
                        MaxY2 = box.y2;
                    }
                    if (minX1 > box.x1) {
                        minX1 = box.x1;
                    }
                    if (minY1 > box.y1) {
                        minY1 = box.y1;
                    }
                    if (MaxX2 < box.x2) {
                        MaxX2 = box.x2;
                    }
                    if (MaxY2 < box.y2) {
                        MaxY2 = box.y2;
                    }
                });
                const width = MaxX2 - minX1,
                    height = MaxY2 - minY1,
                    x = minX1 + width / 2,
                    y = minY1 + height / 2,
                    id = "team" + uniqueId();
                const model = {
                    id: id,
                    width,
                    height,
                    x,
                    y,
                    shape: "teamNode"
                };
                this.command.executeCommand("add", model);
                // const item = this.graph.findById(id);
                // item.get("group").toBack();
                // const edgeGroup = this.graph.get("edgeGroup");
                // edgeGroup.toFront();
                // this.graph.paint();
            },
            previewData() {
                this.InfoData = Object.assign(this.ProjectData, this.graph.save());
                this.InfoVisible = true;
                this.$nextTick(() => {
                    this.$refs.CanvasInfo.init();
                })
            },
            handleNewProject() {
                if (!this.modifyIsSave && this.InfoData.id) {
                    this.$confirm('当前项目未保存，是否保存?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.saveFlow();
                        this.showNewProject();
                    }).catch(() => {
                        this.showNewProject();
                    });
                } else {
                    this.showNewProject();
                }
            },
            showNewProject() {
                this.createVisible = true;
                this.$nextTick(() => {
                    this.$refs.createFlow.init();
                })
            },
            flowNew(data) {
                console.log("data", data)
                this.graph.clear();
                this.command.create();
                this.undoList = [];
                this.redoList = [];
                this.copyData = [];
                // this.ProjectData = Object.assign({}, this.flowInitData, data);
                this.ProjectData = data
                console.log("1ui2h3uedu", this.ProjectData)
                eventBus.$emit("projectChange", this.ProjectData);
            }
        }
    };
</script>


<style scoped>
    @import '../../../assets/flow/tools/iconfont.css';
    .toolarea {
        width: 100%;
        height: 42px;
        box-shadow: 0px 8px 12px 0px rgba(0, 52, 107, 0.04);
        border: 1px solid #e9e9e9;
        position: absolute;
        /* z-index: 1; */
    }

    .toolbar {
        box-sizing: border-box;
        padding: 12px 0px;
        /* width: calc(100% - 100px); */
        height: 100%;
        z-index: 3;
    }

    .toolbar .command:nth-of-type(1) {
        margin-left: 24px;
    }

    .toolbar .command {
        box-sizing: border-box;
        width: 27px;
        height: 27px;
        margin: 0px 6px;
        border-radius: 2px;
        padding-left: 4px;
        display: inline-block;
        border: 1px solid rgba(2, 2, 2, 0);
    }

    .toolbar .command:hover {
        cursor: pointer;
        border: 1px solid #e9e9e9;
    }

    .toolbar .disable {
        color: rgba(0, 0, 0, 0.25);
    }

    .toolbar .separator {
        margin: 4px;
        border-left: 1px solid #e9e9e9;
    }

    .extra-item {
        font-size: 18px;
        margin-left: 20px;
        color: lightskyblue;
    }
    .modify-save {
      font-size: 17px;
      margin-left: 10px;
      color: red;
      font-weight: bold;
    }
</style>
