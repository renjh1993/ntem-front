<template>
  <div class="page">
    <div :id="pageId" class="graph-container" style="position: relative;"></div>
  </div>
</template>


<script>
    import G6 from "@antv/g6";
    import {
        initBehavors
    } from "@/behavior";
    import eventBus from "@/utils/flow/eventBus";
    export default {
        data() {
            return {
                pageId: "graph-container",
                graph: null,
                ProjectData: {
                    'name': '',
                    'id': '',
                    'nodes': [],
                    'edges': []
                },
                node: {}
            };
        },
        props: {
            height: {
                type: Number,
                default: 0
            },
            width: {
                type: Number,
                default: 0
            },
            data: {
                type: Object,
                default: () => {}
            }
        },
        created() {
            initBehavors();
        },
        mounted() {
            this.$nextTick(() => {
                this.init();
            });
            eventBus.$on("projectChange", item => {
                Object.assign(this.ProjectData, item);
            });
            eventBus.$on("observer-flow", item => {
              this.ProjectData = item
              if (this.ProjectData.tplContent !== '' && this.ProjectData.tplContent != null) {
                let jsonData = JSON.parse(this.ProjectData.tplContent);
                this.graph.read(jsonData)
              }
              // let jsonData = item.tplContent;
            });
            eventBus.$on("changeCustomLabel", item => {
              let node = item.node
              item.node.label = item.value
              this.graph.refresh(node)
            })
            // eventBus.$on("newTrading", item =>{
            //   Object.assign
            // });
            // this.graph.on("projectChange", evt => {
            //   let jsonData = JSON.parse(evt.tplContent);
            //   console.log("jsonData", jsonData)
            //   this.graph.read(jsonData)
            // })
        },
        methods: {
            init() {
                const height = this.height
                const width = this.width

                this.graph = new G6.Graph({
                    container: "graph-container",
                    height: height,
                    width: width,
                    // defaultEdge: {
                    //     type: 'polyline',
                    //     // ... 其他配置
                    //     style: {
                    //         stroke: '#eaff8f',
                    //     },
                    //     labelPosition: 'center',
                    //     label: 'edge-label',
                    //     labelCfg: {
                    //         refY: -10,
                    //         refX: 60,
                    //         position: 'middle',
                    //         autoRotate: 'true',
                    //         style: {
                    //             fill: '#000',
                    //             fontStyle: 'normal',
                    //             fontWeight: 400,
                    //             fontSize: 50,
                    //             textAlign: 'center',
                    //             opacity: 1
                    //         }
                    //     },
                    // },
                    modes: {
                        // 支持的 behavior
                        default: [
                            "drag-canvas",
                            "zoom-canvas",
                            "hover-node",
                            "select-node",
                            "hover-edge",
                            "keyboard",
                            "customer-events",
                            "add-menu"
                        ],
                        mulitSelect: ["mulit-select"],
                        addEdge: ["add-edge"],
                        moveNode: ["drag-item"]
                    }
                });
                this.graph.on('afteradditem', evt => {
                    // 监听add ，addItem
                    // console.log('afteradditem', evt);
                    if (this.ProjectData.id === '' && this.ProjectData.name === '') {
                        this.graph.remove(evt.item);
                        this.$message.warning('请先创建流程');
                    }
                    if (this.ProjectData.tplType === '03' && evt.model.nodeType === 'subcmp') {
                      this.graph.remove(evt.item);
                      this.$message.warning('子流程内不允许添加子流程组件');
                    }
                    if (evt.model.nodeType === 'start') {
                        const nodes = this.graph.getNodes();
                        for (const item of nodes) {
                            if (item._cfg.model.nodeType === evt.model.nodeType && item._cfg.model.id !== evt.model.id) {
                                this.graph.remove(evt.item);
                                this.$message.warning('只能有一个开始节点');
                            }
                        }
                    }
                    if (evt.model.shape === 'customEdgeOld') {
                        if (evt.model.sourceNode._cfg.id === evt.model.target._cfg.id) {
                            this.graph.remove(evt.item);
                            this.$message.warning('模块內不允许链接');
                            return;
                        }
                        const edges = this.graph.getEdges();
                        for (const item of edges) {
                            console.log('item66', item)
                            if (item._cfg.source._cfg.id === evt.model.source._cfg.id && item._cfg.target._cfg.id === evt.model.target._cfg.id && item._cfg.id !== evt.model.id) {
                                this.graph.remove(evt.item);
                                this.$message.warning('两模块间不允许多次链接');
                            }
                        }
                    }
                    if (evt.model.shape === 'customEdge') {
                      if (evt.model.source._cfg.model.beanName === 'fork'){
                        eventBus.$emit("addForkEdge", {target : evt.item})
                      }
                    }
                    if (evt.model.nodeType === 'customComponent' & evt.model.label === '自定义') {
                      let node = evt.model
                      node.label = 'MyComponent'
                      this.graph.refresh(node)
                    }
                })
                this.graph.on('add-edge', evt => {
                    // 监听add ，addItem
                    console.log(688, evt)
                        // if (evt.model.name === "start") {
                        //   const nodes = this.graph.getNodes();
                        //   for (const item of nodes) {
                        //     if (item._cfg.model.name === evt.model.name && item._cfg.model.id !== evt.model.id) {
                        //       this.graph.remove(evt.item);
                        //       this.$message.warning("只能有一个开始节点");
                        //     }
                        //   }
                        // }
                })
                const {
                    editor,
                    command
                } = this.$parent;
                editor.emit("afterAddPage", {
                    graph: this.graph,
                    command
                });
                this.readData();
            },
            readData() {
                let data = this.data;
                if (data) {
                    this.graph.read(data);
                }
            },
        }
    };
</script>

<style scoped>
    /*.page {*/
    /*    margin-left: 200px;*/
    /*    margin-right: 200px;*/
    /*}*/
</style>
