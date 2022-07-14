<template>
  <el-scrollbar wrap-class="scrollbar-wrapper" style="width: 100%;height:100%;">
    <el-menu default-active="1" class="flow-menu" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <el-submenu :index="menu.name" v-for="menu in list" :key="menu.name">
        <template slot="title">
          <i :class="menu.icon"></i>
          <span slot="title">{{menu.label}}</span>
        </template>
        <el-menu-item :index="item.name" v-for="item in menu.children">
            <div class="getItem" :data-shape="item.shape" :data-type="item.type" :data-size="item.size" draggable @dragstart="handleDragstart" @dragend="handleDragEnd($event,item)">
                <img :src="item.image" /><span>{{ item.label }}</span>
            </div>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-scrollbar>
</template>

<script>
    import eventBus from "@/utils/flow/eventBus"
    import okSvg from "@/assets/flow/icons/ok.svg"
    import svg from "./svgBase64.js"
    import { listCmp } from "@/api/flow/cmpDef"
    export default {
        data() {
            return {
                page: null,
                command: null,
                offsetX: 0,
                offsetY: 0,
                list: [{
                    name: 'concmp',
                    label: '控制组件',
                    icon: 'iconfont icon-control',
                    children: [{
                        nodeType: 'start',
                        beanName: 'start',
                        label: "开始",
                        type: 'node',
                        x: 0,
                        y: 0,
                        size: '160*60',
                        shape: 'customNode',
                        color: '#FA8C16',
                        image: svg.start,
                        stateImage: okSvg,
                        inPoints: [],
                        outPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ]
                    }, {
                        nodeType: 'end',
                        beanName: 'end',
                        label: "结束",
                        type: 'node',
                        x: 0,
                        y: 0,
                        size: '160*60',
                        shape: 'customNode',
                        color: '#FA8C16',
                        image: svg.end,
                        stateImage: okSvg,
                        inPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ],
                        outPoints: []
                    }, {
                        nodeType: 'decision',
                        beanName: 'decision',
                        label: "分支",
                        type: 'node',
                        size: '200*60',
                        x: 0,
                        y: 0,
                        shape: 'customNode',
                        color: '#FA8C16',
                        image: svg.decssion,
                        stateImage: okSvg,
                        inPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ],
                        outPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ]
                    }, {
                        nodeType: 'fork',
                        beanName: 'fork',
                        label: "并发开始",
                        type: 'node',
                        size: '200*60',
                        x: 0,
                        y: 0,
                        shape: 'customNode',
                        color: '#FA8C16',
                        image: svg.concurrent,
                        stateImage: okSvg,
                        IS_ASYN: false,
                        inPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ],
                        outPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ]
                    }, {
                        nodeType: 'join',
                        beanName: 'join',
                        label: '并发结束',
                        type: 'node',
                        x: 0,
                        y: 0,
                        size: '200*60',
                        shape: 'customNode',
                        color: '#FA8C16',
                        image: svg.concurrentEnd,
                        stateImage: okSvg,
                        inPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ],
                        outPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ]
                    }, {
                        nodeType: 'sloop',
                        beanName: 'sloop',
                        label: '循环开始',
                        type: 'node',
                        x: 0,
                        y: 0,
                        size: '200*60',
                        shape: 'customNode',
                        color: '#FA8C16',
                        image: svg.recycle,
                        stateImage: okSvg,
                        inPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ],
                        outPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ]
                    }, {
                        nodeType: 'eloop',
                        beanName: 'eloop',
                        label: '循环结束',
                        type: 'node',
                        x: 0,
                        y: 0,
                        size: '200*60',
                        shape: 'customNode',
                        color: '#FA8C16',
                        image: svg.recycleEnd,
                        stateImage: okSvg,
                        inPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ],
                        outPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ]
                    }, {
                        nodeType: 'lstransition',
                        beanName: 'lstransition',
                        label: '本地事务开始',
                        type: 'node',
                        x: 0,
                        y: 0,
                        size: '200*60',
                        shape: 'customNode',
                        color: '#FA8C16',
                        image: svg.localtrans,
                        stateImage: okSvg,
                        inPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ],
                        outPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ]
                    }, {
                        nodeType: 'letransition',
                        beanName: 'letransition',
                        label: '本地事务结束',
                        type: 'node',
                        x: 0,
                        y: 0,
                        size: '200*60',
                        shape: 'customNode',
                        color: '#FA8C16',
                        image: svg.localtransEnd,
                        stateImage: okSvg,
                        inPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ],
                        outPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ]
                    }, {
                        nodeType: 'gstransition',
                        beanName: 'gstransition',
                        label: '全局事务开始',
                        type: 'node',
                        x: 0,
                        y: 0,
                        size: '200*60',
                        shape: 'customNode',
                        color: '#FA8C16',
                        image: svg.globaltrans,
                        stateImage: okSvg,
                        inPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ],
                        outPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ]
                    }, {
                        nodeType: 'getransition',
                        beanName: 'getransition',
                        label: '全局事务结束',
                        type: 'node',
                        x: 0,
                        y: 0,
                        size: '200*60',
                        shape: 'customNode',
                        color: '#FA8C16',
                        image: svg.globaltransEnd,
                        stateImage: okSvg,
                        inPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ],
                        outPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ]
                    }]
                }, {
                    name: 'pubbasecmp',
                    label: '公共技术组件',
                    icon: 'iconfont icon-gonggong',
                    children: []
                }, {
                    name: 'pubbusicmp',
                    label: '公共业务组件',
                    icon: 'iconfont icon-gonggong',
                    children: []
                }, {
                    name: 'selcmp',
                    label: '扩展组件',
                    icon: 'iconfont icon-kuozhan',
                    children: []
                }, {
                    name: 'subflow',
                    label: '子流程',
                    icon: 'iconfont icon-ziliucheng',
                    children: [{
                        nodeType: 'subcmp',
                        label: '子流程',
                        type: 'node',
                        x: 0,
                        y: 0,
                        size: '200*60',
                        shape: 'customNode',
                        color: '#FA8C16',
                        image: svg.submode,
                        stateImage: okSvg,
                        inPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ],
                        outPoints: [
                            [0, 0.5],
                            [0.5, 1],
                            [1, 0.5],
                            [0.5, 0]
                        ]
                    }]
                }],
                isCollapse: false
            }
        },
        created() {
            this.bindEvent()
            this.getBaseCmpList()
            this.getBusiCmpList()
            this.getSubCmpList()
            this.getCustomCmpList()
        },
        methods: {
            handleOpen(key, keyPath) {
                // console.log(key, keyPath)
            },
            handleClose(key, keyPath) {
                // console.log(key, keyPath)
            },
            handleDragstart(e) {
                this.offsetX = e.offsetX
                this.offsetY = e.offsetY
            },
            handleDragEnd(e, item) {
                console.log("888", e, item)
                let data = {}
                Object.assign(data, item)
                data.offsetX = this.offsetX
                data.offsetY = this.offsetY
                if (this.page) {
                    const graph = this.page.graph
                    console.log("graph", graph)
                        // const size = e.target.dataset.size.split("*")
                    const xy = graph.getPointByClient(e.x, e.y)
                    data.x = xy.x
                    data.y = xy.y
                    data.size = item.size.split("*")
                    data.type = "node"
                    this.command.executeCommand("add", [data])
                }
            },
            bindEvent() {
                eventBus.$on("afterAddPage", page => {
                    this.page = page
                    this.command = page.command
                })
                // eventBus.$on("afterSelectCustom", () => {
                //     this.page = this.page
                //     this.command = this.command
                //     console.log("在这里123999", this.page)
                // })
            },
            getBaseCmpList() {
              listCmp(160).then(response => {
                const pubbasecmp = response.data
                this.list[1].children = pubbasecmp.map(item => {
                  return {
                    nodeType: item.beanName,
                    beanName: item.beanName,
                    label: item.sdesc,
                    type: 'node',
                    x: 0,
                    y: 0,
                    size: '200*60',
                    shape: 'customNode',
                    color: '#FA8C16',
                    image: svg.pubbasecmp,
                    stateImage: okSvg,
                    inPoints: [
                      [0, 0.5],
                      [0.5, 1],
                      [1, 0.5],
                      [0.5, 0]
                    ],
                    outPoints: [
                      [0, 0.5],
                      [0.5, 1],
                      [1, 0.5],
                      [0.5, 0]
                    ]
                  }
                })
              })
            },
            getBusiCmpList() {
              listCmp(170).then(response => {
                const pubbusicmp = response.data
                this.list[2].children = pubbusicmp.map(item => {
                  return {
                    nodeType: item.beanName,
                    beanName: item.beanName,
                    label: item.sdesc,
                    type: 'node',
                    x: 0,
                    y: 0,
                    size: '200*60',
                    shape: 'customNode',
                    color: '#FA8C16',
                    image: svg.pubbusicmp,
                    stateImage: okSvg,
                    inPoints: [
                      [0, 0.5],
                      [0.5, 1],
                      [1, 0.5],
                      [0.5, 0]
                    ],
                    outPoints: [
                      [0, 0.5],
                      [0.5, 1],
                      [1, 0.5],
                      [0.5, 0]
                    ]
                  }
                })
              })
            },
            getCustomCmpList() {
              listCmp(180).then(response => {
                const customCmp = response.data
                this.list[3].children = customCmp.map(item => {
                  return {
                    nodeType: item.beanName,
                    beanName: item.beanName,
                    label: item.sdesc,
                    type: 'node',
                    x: 0,
                    y: 0,
                    size: '200*60',
                    shape: 'customNode',
                    color: '#FA8C16',
                    image: svg.self,
                    stateImage: okSvg,
                    inPoints: [
                      [0, 0.5],
                      [0.5, 1],
                      [1, 0.5],
                      [0.5, 0]
                    ],
                    outPoints: [
                      [0, 0.5],
                      [0.5, 1],
                      [1, 0.5],
                      [0.5, 0]
                    ]
                  }
                })
              })
            },
            getSubCmpList() {
              listCmp(190).then(response => {
                const subFlowCmp = response.data
                this.list[4].children = subFlowCmp.map(item => {
                  return {
                    nodeType: 'subcmp',
                    beanName: item.beanName,
                    label: item.sdesc,
                    type: 'node',
                    x: 0,
                    y: 0,
                    size: '200*60',
                    shape: 'customNode',
                    color: '#FA8C16',
                    image: svg.submode,
                    stateImage: okSvg,
                    // subCmpPk: item.subFlowTplPk,
                    inPoints: [
                      [0, 0.5],
                      [0.5, 1],
                      [1, 0.5],
                      [0.5, 0]
                    ],
                    outPoints: [
                      [0, 0.5],
                      [0.5, 1],
                      [1, 0.5],
                      [0.5, 0]
                    ]
                  }
                })
                eventBus.$emit("selectSubCmp", subFlowCmp)
              })
            }
        }
    }
</script>

<style scoped>
    .el-scrollbar__wrap {
        overflow-x: hidden !important;
    }

    .getItem {
        height: 100%;
        display: inline-flex;
        align-items: center;
    }

    .getItem img {
        height: calc(100% - 20px);
        width: auto;
        margin-right: 10px;
    }
</style>
