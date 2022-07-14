import { uniqueId } from '@/utils/flow'
class command {
    editor = null;
    undoList = []
    redoList = []
    clipboard = {}
    constructor(editor) {
        this.editor = editor;
    }
    executeCommand(key, datas) {
        const list = []
        datas.map(data => {
            let model = data
            if (key === 'add') {
                model.id = data.type + uniqueId()
            }
            if (key === 'delete') {
                if (data.getType() === 'node') {
                    const edges = data.getEdges()
                    model = data.getModel()
                    model.type = data.getType()
                    model.id = data.get('id')
                    edges.forEach(edge => {
                        let edgeModel = edge.getModel()
                        edgeModel.type = 'edge'
                        edgeModel.id = edge.get('id')
                        list.push(edgeModel)
                    })
                } else if (data.getType() === 'edge') {
                    model = data.getModel()
                    model.type = data.getType()
                    model.id = data.get('id')
                }
            }
            list.push(model)

            this.doCommand(key, model)

        });
        this.undoList.push({ key, datas: list })
        if (key === 'delete') {
            this.redoList = []
        }
        this.editor.emit(key, { undoList: this.undoList, redoList: this.redoList })
    }
    doCommand(key, data) {
        switch (key) {
            case 'add':
                this.add(data.type, data)
                break;
            case "update":
                this.update(data.item, data.newModel)
                break
            case "delete":
                this.remove(data)
                break
        }
    }
    add(type, item) {
        this.editor.add(type, item)
    }
    copy(data) {
        this.clipboard = {
            data,
            count: 0
        }
    }
    paste(from, position) {
        const data = this.clipboard.data
        this.clipboard.count++
            if (data.length) {
                data.forEach((item) => {
                    const model = item._cfg.model
                        // 计算坐标，添加一定偏移量，防止重叠
                    let x = model.x + 10 * this.clipboard.count
                    let y = model.y + 10 * this.clipboard.count
                        // 如果通过右键菜单触发的，则获取触发菜单时的canvas坐标
                    if (from === 'ContextMenu' && position.data) {
                        if (position.data.hasOwnProperty('canvasX')) {
                            x = model.x + position.data.canvasX - data[0].model.x
                        }
                        if (position.data.hasOwnProperty('canvasY')) {
                            y = model.y + position.data.canvasY - data[0].model.y
                        }
                    }
                    const node = {
                        ...model,
                        id: model.type + uniqueId(),
                        x,
                        y
                    }
                    this.add('node', node)
                })
            }
    }
    update(item, model) {
        this.editor.update(item, model)
    }
    remove(item) {
        this.editor.remove(item)
    }
    undo() {
        const undoData = this.undoList.pop()
        const edgeList = []
        const list = []
        for (let i = 0; i < undoData.datas.length; i++) {
            const data = undoData.datas[i]
            if (data.type === 'edge') {
                edgeList.push(data)
                continue
            }
            list.push(data)
            this.doundo(undoData.key, data)
        }
        for (let i = 0; i < edgeList.length; i++) {
            const edge = edgeList[i]
            if (edge.source.destroyed) {
                edge.source = edge.sourceId

            }
            if (edge.target.destroyed) {
                edge.target = edge.targetId
            }
            list.push(edge)
            this.doundo(undoData.key, edge)
        }
        this.redoList.push({ key: undoData.key, datas: list })
        this.editor.emit(undoData.key, { undoList: this.undoList, redoList: this.redoList })
    }
    doundo(key, data) {
        switch (key) {
            case 'add':
                this.remove(data)
                break;
            case "update":
                this.update(data.item, data.oldModel)
                break
            case "delete":
                this.add(data.type, data)
                break
        }
    }
    redo() {
        const redoData = this.redoList.pop()
        const list = []
        const edgeList = []
        for (let i = 0; i < redoData.datas.length; i++) {
            const data = redoData.datas[i]
            if (data.type === 'edge') {
                edgeList.push(data)
                continue
            }
            list.push(data)
            this.doredo(redoData.key, data)
        }
        for (let i = 0; i < edgeList.length; i++) {
            const edge = edgeList[i]
            if (edge.source.destroyed) {
                edge.source = edge.sourceId

            }
            if (edge.target.destroyed) {
                edge.target = edge.targetId
            }
            list.push(edge)
            this.doredo(redoData.key, edge)
        }
        this.undoList.push({ key: redoData.key, datas: list })

        this.editor.emit(redoData.key, { undoList: this.undoList, redoList: this.redoList })
    }
    doredo(key, data) {
        switch (key) {
            case 'add':
                this.add(data.type, data)
                break;
            case "update":
                this.update(data.item, data.newModel)
                break
            case "delete":
                this.remove(data)
                break
        }
    }
    delete(item) {
        this.executeCommand('delete', [item])
    }
    create() {
        this.undoList = []
        this.redoList = []
        this.clipboard = {}
    }
}

export default command;
