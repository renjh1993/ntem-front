import G6 from "@antv/g6";
import { uniqueId } from '@/utils/flow'
const customNode = {
    init() {
        G6.registerNode("customNode", {
            draw(cfg, group) {
                let size = cfg.size;
                if (!size) {
                    size = [170, 34]
                }
                // 此处必须是NUMBER 不然bbox不正常
                const width = parseInt(size[0]);
                const height = parseInt(size[1]);
                const color = cfg.color;
                // 此处必须有偏移 不然drag-node错位
                const offsetX = -width / 2
                const offsetY = -height / 2
                const mainId = 'rect' + uniqueId()
                const shape = group.addShape("rect", {
                    attrs: {
                        id: mainId,
                        x: offsetX,
                        y: offsetY,
                        width: width,
                        height: height,
                        stroke: "#ced4d9",
                        fill: '#fff', //此处必须有fill 不然不能触发事件
                        radius: 4
                    }
                });
                group.addShape("rect", {
                    attrs: {
                        x: offsetX,
                        y: offsetY,
                        width: 4,
                        height: height,
                        fill: color,
                        parent: mainId,
                        radius: [4, 0, 0, 4]
                    }
                });
                group.addShape("image", {
                    attrs: {
                        x: offsetX + 16,
                        y: -15,
                        width: 30,
                        height: 30,
                        img: cfg.image,
                        parent: mainId
                    }
                });
                group.addShape("image", {
                    attrs: {
                        x: offsetX + width - 32,
                        y: -8,
                        width: 16,
                        height: 16,
                        parent: mainId,
                        img: cfg.stateImage
                    }
                });
                if (cfg.backImage) {
                    const clip = new Shape.Rect({
                        attrs: {
                            x: offsetX,
                            y: offsetY,
                            width: width,
                            height: height,
                            fill: '#fff',
                            radius: 4
                        }
                    });
                    group.addShape("image", {
                        attrs: {
                            x: offsetX,
                            y: offsetY,
                            width: width,
                            height: height,
                            img: cfg.backImage,
                            clip: clip
                        }
                    });
                }
                if (cfg.label) {
                    group.addShape("text", {
                        attrs: {
                            id: 'label' + uniqueId(),
                            x: offsetX + width / 2,
                            y: offsetY + height / 2,
                            textAlign: "center",
                            textBaseline: "middle",
                            text: cfg.label,
                            parent: mainId,
                            fill: "#565758"
                        }
                    });
                }

                if (cfg.inPoints || cfg.outPoints) {
                    let inPointsOnly = [], outPointsOnly = [], bothPoints = []
                    if ((cfg.inPoints.length == 0 || !cfg.inPoints) || (cfg.outPoints.length == 0 || !cfg.outPoints)) {
                        outPointsOnly = cfg.outPoints
                        inPointsOnly = cfg.inPoints
                    } else {
                        let bothhave = cfg.inPoints.filter(function (item) {
                            let bothhave = cfg.outPoints.filter(function (itemsub) {
                                return item[ 0 ] == itemsub[ 0 ] && item[ 1 ] == itemsub[ 1 ]
                            })
                            return bothhave.length>0
                        })
                        bothPoints = bothhave

                        inPointsOnly = cfg.inPoints.filter(function (item) {
                            let onlyPoint = bothPoints.filter(function (itemsub) {
                                return item[ 0 ] == itemsub[ 0 ] && item[ 1 ] == itemsub[ 1 ]
                            })
                            return onlyPoint.length == 0
                        })

                        outPointsOnly = cfg.outPoints.filter(function (item) {
                            let onlyPoint = bothPoints.filter(function (itemsub) {
                                return item[ 0 ] == itemsub[ 0 ] && item[ 1 ] == itemsub[ 1 ]
                            })
                            return onlyPoint.length == 0
                        })
                    }

                    //接入接出节点
                    for (let i = 0; i < bothPoints.length; i++) {
                        let x,
                            y = 0;
                        //0为顶 1为底
                        if (bothPoints[ i ][ 0 ] <= 0) {
                            y = 0;
                        } else if (bothPoints[ i ][ 0 ] >= 1) {
                            y = height;
                        } else {
                            y = height * bothPoints[ i ][ 0 ];
                        }
                        x = width * bothPoints[ i ][ 1 ];
                        const id = 'circle' + uniqueId()
                        group.addShape("circle", {
                            attrs: {
                                id: 'circle' + uniqueId(),
                                parent: id,
                                x: x + offsetX,
                                y: y + offsetY,
                                r: 10,
                                isInPointOut: true,
                                isOutPointOut: true,
                                fill: "#1890ff",
                                opacity: 0
                            }
                        });
                        group.addShape("circle", {
                            attrs: {
                                id: id,
                                x: x + offsetX,
                                y: y + offsetY,
                                r: 5,
                                isInPoint: true,
                                isOutPoint: true,
                                fill: "#fff",
                                stroke: "#1890ff",
                                opacity: 0
                            }
                        });
                    }

                    //单接入点
                    for (let i = 0; i < inPointsOnly.length; i++) {
                        let x,
                            y = 0;
                        //0为顶 1为底
                        if (inPointsOnly[i][0] <= 0) {
                            y = 0;
                        } else if (inPointsOnly[i][0] >= 1) {
                            y = height;
                        } else {
                            y = height * inPointsOnly[i][0];
                        }
                        x = width * inPointsOnly[i][1];
                        const id = 'circle' + uniqueId()
                        group.addShape("circle", {
                            attrs: {
                                id: 'circle' + uniqueId(),
                                parent: id,
                                x: x + offsetX,
                                y: y + offsetY,
                                r: 10,
                                isInPointOut: true,
                                fill: "#1890ff",
                                opacity: 0
                            }
                        });
                        group.addShape("circle", {
                            attrs: {
                                id: id,
                                x: x + offsetX,
                                y: y + offsetY,
                                r: 5,
                                isInPoint: true,
                                fill: "#fff",
                                stroke: "#1890ff",
                                opacity: 0
                            }
                        });
                    }

                    //单接出点
                    for (let i = 0; i < outPointsOnly.length; i++) {
                        let x,
                            y = 0;
                        //0为顶 1为底
                        if (outPointsOnly[ i ][ 0 ] <= 0) {
                            y = 0;
                        } else if (outPointsOnly[ i ][ 0 ] >= 1) {
                            y = height;
                        } else {
                            y = height * outPointsOnly[ i ][ 0 ];
                        }
                        x = width * outPointsOnly[ i ][ 1 ];
                        const id = 'circle' + uniqueId()
                        group.addShape("circle", {
                            attrs: {
                                id: 'circle' + uniqueId(),
                                parent: id,
                                x: x + offsetX,
                                y: y + offsetY,
                                r: 10,
                                isOutPointOut: true,
                                fill: "#FF9D5A",
                                opacity: 0 //默認0 需要時改成0.3
                            }
                        });
                        group.addShape("circle", {
                            attrs: {
                                id: id,
                                x: x + offsetX,
                                y: y + offsetY,
                                r: 5,
                                isOutPoint: true,
                                fill: "#fff",
                                stroke: "#FF9D5A",
                                opacity: 0
                            }
                        });
                    }
                }

                //group.sort()
                // 添加文本、更多图形
                return shape;
            },
            //设置状态
            setState(name, value, item) {
                const group = item.getContainer();
                const shape = group.get("children")[0]; // 顺序根据 draw 时确定

                const children = group.findAll(g => {
                    return g._attrs.parent === shape._attrs.id
                });
                const circles = group.findAll(circle => {
                    return circle._attrs.isInPoint || circle._attrs.isOutPoint;
                });
                const selectStyles = () => {
                    shape.attr("fill", "#f3f9ff");
                    shape.attr("stroke", "#6ab7ff");
                    shape.attr("cursor", "move");
                    children.forEach(child => {
                        child.attr("cursor", "move");
                    });
                    circles.forEach(circle => {
                        circle.attr('opacity', 1)
                    })
                };
                const unSelectStyles = () => {
                    shape.attr("fill", "#fff");
                    shape.attr("stroke", "#ced4d9");
                    circles.forEach(circle => {
                        circle.attr('opacity', 0)
                    })
                };
                switch (name) {
                    case "selected":
                    case "hover":
                        if (value) {
                            selectStyles()
                        } else {
                            unSelectStyles()
                        }
                        break;
                }
            }
        });
    }
}

export default customNode
