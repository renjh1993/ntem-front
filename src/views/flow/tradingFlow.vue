<template>
  <div id="mountNode" :style="{width:width}">
    <div class="editor" >
      <!--contextmenu 右键菜单-->
      <context-menu />
      <!--toolbar 工具栏-->
<!--      <toolbar/>-->
<!--      <div style="height: 42px;"></div>-->
      <div class="bottom-container">
        <!--itempannel 组件菜单-->
        <item-panel v-show="false" />
        <!--detailpannel 参数详情-->
        <trading-detail :intfId="intfData.intfId"/>
        <!--miniMap 缩略图-->
        <minimap />
        <!--page 画布-->
        <page :data="data" :height="height" :width="width" />
      </div>
<!--      <flow-dialog />-->
      <custom-dialog />
    </div>
    <Flow />
  </div>
</template>

<script>
  import Toolbar from "@/components/flow/Toolbar";
  import ItemPanel from "@/components/flow/ItemPanel";
  import TradingDetail from "@/components/flow/DetailPanel/tradingDetail";
  import Minimap from "@/components/flow/Minimap";
  import Page from "@/components/flow/Page";
  import Flow from "@/components/flow/Flow"
  import ContextMenu from "@/components/flow/ContextMenu";
  import Editor from "@/components/flow/Base/Editor";
  import command from "@/command";
  import eventBus from "@/utils/flow/eventBus"
  import { getIntf } from "@/api/configuration/intf"
  import { getTemplateByPk } from "@/api/flow/flow"
  import CustomDialog from "@/components/flow/CustomDialog"
  export default {
    name: "TradingFlow",
    components: {
      Toolbar,
      ItemPanel,
      TradingDetail,
      Minimap,
      Page,
      ContextMenu,
      Flow,
      CustomDialog
    },
    props: {
      height: {
        type: Number,
        default: document.documentElement.clientHeight -42
      },
      width: {
        type: Number,
        default: document.documentElement.clientWidth - 400
      },
      data: {
        type: Object,
        default: () => {}
      }
    },
    created() {
      console.log("1888888866", this.height, this.width, document.documentElement)
      this.init();
      // this.getRow();
      this.intfPk = this.$route.query.intfPk
      console.log("zoulezheliintfPk", this.intfPk)
      this.getIntfData(this.intfPk)
      this.bindEvent()
    },
    mounted() {
      // this.getRow()
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
        intfPk: null,
        intfData: [],
      };
    },
    methods: {
      init() {
        this.editor = new Editor();
        this.command = new command(this.editor);
      },
      bindEvent() {
        eventBus.$on('subcmpDbclick', () => {
          console.log("whe9q2u3r")
          if (this.subFlowPk === null) {
            this.msgError("请先选择子流程组件")
          } else {
            const {href} = this.$router.resolve({
              path: '/viewFlow',
              query: {flowTplPk: this.subFlowPk}
            })
            window.open(href, '_blank')
          }
        })
        eventBus.$on('transSubFlowPk', subFlowPk => {
          this.subFlowPk = subFlowPk.target
        })
      },
      getIntfData(intfId) {
        getIntf(intfId).then(response => {
          console.log("response", response)
          this.intfData = response.data
          console.log("intfData", this.intfData)
          let tplData = {}
          getTemplateByPk(this.intfData.flowTplPk).then(response => {
            tplData = response.data
            eventBus.$emit("observer-flow", tplData)
          })
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
