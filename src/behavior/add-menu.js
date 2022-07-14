import eventBus from "@/utils/flow/eventBus";
export default {
    getEvents() {
        return {
            'node:contextmenu': 'onContextmenu',
            'mousedown': 'onMousedown',
            'canvas:click': 'onCanvasClick',
            'edge:contextmenu': 'onEdgeContextmenu',
        };
    },
    onContextmenu(e) {
        eventBus.$emit('contextmenuClick', e)
    },
    onEdgeContextmenu(e) {
        eventBus.$emit('edgeContextmenuClick', e)
    },
    onMousedown(e) {
        eventBus.$emit('mousedown', e)
    },
    onCanvasClick(e) {
        eventBus.$emit('canvasClick', e)
    }

};
