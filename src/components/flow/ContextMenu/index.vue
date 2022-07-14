<template>
  <div>
    <ul class="el-scrollbar__view el-select-dropdown__list context-menu" @mouseleave="hiddleContextMenu" ref="contextMenu">
      <li
        class="el-select-dropdown__item"
        v-for="menu in menus"
        :key="menu.command"
        @click="handleClick(menu)"
      >{{menu.name}}</li>
    </ul>
  </div>
</template>

<script>
    import eventBus from "@/utils/flow/eventBus";
    export default {
        data() {
            return {
                menus: [{
                    command: "copy",
                    name: "复制"
                }, {
                    command: "paste",
                    name: "粘贴"
                }, {
                    command: "delete",
                    name: "删除"
                }]
            };
        },
        created() {
            this.bindEvent();
        },
        methods: {
            init() {},
            bindEvent() {
                eventBus.$on("contextmenuClick", e => {
                    this.menus = [{
                        command: "copy",
                        name: "复制"
                    }, {
                        command: "paste",
                        name: "粘贴"
                    }, {
                        command: "delete",
                        name: "删除"
                    }];
                    const menu = this.$refs.contextMenu;
                    menu.style.left = e.clientX + "px";
                    menu.style.top = e.clientY + "px";
                    menu.style.display = "block";
                });
                eventBus.$on("edgeContextmenuClick", e => {
                    this.menus = [{
                        command: "delete",
                        name: "删除"
                    }];
                    const menu = this.$refs.contextMenu;
                    menu.style.left = e.clientX + "px";
                    menu.style.top = e.clientY + "px";
                    menu.style.display = "block";
                });
                eventBus.$on("mousedown", () => {
                    const menu = this.$refs.contextMenu;
                    menu.style.display = "none";
                });
            },
            hiddleContextMenu() {
                const menu = this.$refs.contextMenu;
                menu.style.display = "none";
            },
            handleClick(item) {
                switch (item.command) {
                    case 'copy':
                        {
                            eventBus.$emit("copyItem", {});
                            break;
                        }
                    case 'paste':
                        {
                            eventBus.$emit("pasteItem", {});
                            break;
                        }
                    case 'delete':
                        {
                            eventBus.$emit("deleteItem", {});
                            break;
                        }
                    default:
                        break;
                }
                const menu = this.$refs.contextMenu;
                menu.style.display = "none";
            }
        }
    };
</script>

<style>
    .context-menu {
        position: absolute;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        margin: 5px 0;
        z-index: 1;
        display: none;
    }

    .context-menu li {
        cursor: pointer;
        font-size: 12px;
        height: 28px;
        line-height: 28px;
    }

    .context-menu li:hover {
        background-color: #f5f7fa;
    }
</style>
