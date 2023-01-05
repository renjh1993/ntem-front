<template>
  <div id="mountNode" :style="{width:width}">
    <div class="editor">
      <!--contextmenu 右键菜单-->
      <context-menu />
      <!--toolbar 工具栏-->
      <toolbar />
      <div style="height: 42px;" />
      <div class="bottom-container">
        <!--itempannel 组件菜单-->
        <item-panel />
        <!--detailpannel 参数详情-->
        <detail-panel />
        <!--miniMap 缩略图-->
        <minimap />
        <!--page 画布-->
        <page :height="height" :width="width" :style="{marginLeft: 200 + 'px', marginRight: 200 + 'px'}" :data="data" />
      </div>
      <custom-dialog />
    </div>
    <Flow />
  </div>
</template>

<script>
import Toolbar from '@/components/flow/Toolbar'
import ItemPanel from '@/components/flow/ItemPanel'
import DetailPanel from '@/components/flow/DetailPanel'
import Minimap from '@/components/flow/Minimap'
import Page from '@/components/flow/Page'
import Flow from '@/components/flow/Flow'
import ContextMenu from '@/components/flow/ContextMenu'
import CustomDialog from '@/components/flow/CustomDialog'
import Editor from '@/components/flow/Base/Editor'
import Command from '@/command'
import eventBus from '@/utils/flow/eventBus'
export default {
  name: 'G6Editor',
  components: {
    Toolbar,
    ItemPanel,
    DetailPanel,
    Minimap,
    Page,
    ContextMenu,
    Flow,
    CustomDialog
  },
  props: {
    height: {
      type: Number,
      default: document.documentElement.clientHeight - 42
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
      subFlowPk: null
    }
  },
  created() {
    this.init()
    this.bindEvent()
  },
  methods: {
    init() {
      this.editor = new Editor()
      this.command = new Command(this.editor)
    },
    bindEvent() {
      eventBus.$on('subcmpDbclick', () => {
        console.log('whe9q2u3r')
        if (this.subFlowPk === null) {
          this.msgError('请先选择子流程组件')
        } else {
          const { href } = this.$router.resolve({
            path: '/viewFlow',
            query: { flowTplPk: this.subFlowPk }
          })
          window.open(href, '_blank')
        }
      })
      eventBus.$on('transSubFlowPk', subFlowPk => {
        this.subFlowPk = subFlowPk.target
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
