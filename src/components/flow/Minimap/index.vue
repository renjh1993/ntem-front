<template>
  <div class="navigator">
    <div class="pannel-title">导航器</div>
    <div id="minimap" class="minimap" ref="minimap"></div>
    <!-- <div id="zoom-slider">
      <a class="zoom-dropdown-btn ant-dropdown-trigger" href="#">
        100 %
        <i class="anticon anticon-down"></i>
      </a>
    </div> -->
  </div>
</template>

<script>
    import {Minimap} from "@antv/g6";
    import eventBus from "@/utils/flow/eventBus";
    export default {
        data() {
            return {
                minimap: null,
                graph: null
            };
        },
        created() {
            this.bindEvent();
        },
        mounted() {
            this.$nextTick(() => {
                this.initMinmap();
            });
        },
        methods: {
            initMinmap() {
                const cfgs = {
                    container: "minimap"
                };
                this.minimap = new Minimap({...cfgs
                });
            },
            bindEvent() {
                eventBus.$on("afterAddPage", page => {
                    this.graph = page.graph;
                    this.bindPage();
                });
            },
            bindPage() {
                if (!this.minimap || !this.graph) {
                    return;
                }
                this.graph.addPlugin(this.minimap)
            }
        }
    };
</script>

<style scoped>
    .navigator {
        width: 240px;
        height: 170px;
        position: absolute;
        bottom: 0px;
        right: 0px;
        z-index: 3;
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
</style>
