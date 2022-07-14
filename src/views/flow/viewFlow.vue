<template>
  <div id="mountNode" :style="{width:width}">
    <div class="editor" >
      <context-menu />
      <div class="bottom-container">
        <!--detailpannel 参数详情-->
        <view-detail />
        <!--miniMap 缩略图-->
        <minimap />
        <!--page 画布-->
        <page :data="data" :height="height" :width="width" />
      </div>
    </div>
    <Flow />
  </div>
</template>

<script>
  import Toolbar from "@/components/flow/Toolbar";
  import ItemPanel from "@/components/flow/ItemPanel";
  import TradingDetail from "@/components/flow/DetailPanel/tradingDetail";
  import ViewDetail from "@/components/flow/DetailPanel/viewDetail"
  import Minimap from "@/components/flow/Minimap";
  import Page from "@/components/flow/Page";
  import Flow from "@/components/flow/Flow"
  import ContextMenu from "@/components/flow/ContextMenu";
  import Editor from "@/components/flow/Base/Editor";
  import command from "@/command";
  import eventBus from "@/utils/flow/eventBus"
  import { getTemplateByPk } from "@/api/flow/flow"
  export default {
    name: "ViewFlow",
    components: {
      Toolbar,
      ItemPanel,
      TradingDetail,
      ViewDetail,
      Minimap,
      Page,
      ContextMenu,
      Flow
    },
    props: {
      height: {
        type: Number,
        default: document.documentElement.clientHeight -42
      },
      width: {
        type: Number,
        default: document.documentElement.clientWidth - 250
      },
      data: {
        type: Object,
        default: () => {}
      }
    },
    created() {
      this.init();
      this.flowTplPk = this.$route.query.flowTplPk
      this.getFlow(this.flowTplPk)
    },
    data() {
      return {
        editor: {},
        command: null,
        ProjectData: {
          'name': '',
          'id': '',
          'type': '',
          'describe': '',
          'nodes': [],
          'edges': []
        },
        intfData: [],
        flowTplPk: null
      };
    },
    methods: {
      init() {
        this.editor = new Editor();
        this.command = new command(this.editor);
      },
      getFlow(flowTplPk) {
        getTemplateByPk(flowTplPk).then(response => {
          let tplData = response.data
          console.log("tplData", tplData)
          eventBus.$emit("observer-flow", tplData)
        })
      }
    }
  };
</script>

<style scoped>
  @import '../../assets/flow/iconfont/iconfont.css';
  .editor {
    position: relative;
    width: 100%;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }

  .bottom-container {
    position: relative;
  }
</style>
