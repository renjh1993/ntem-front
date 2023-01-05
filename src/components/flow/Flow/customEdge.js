import G6 from "@antv/g6";
// import { pointsToPolygon } from '@antv/g6/lib/util/path';
// import { pathFinder } from '@antv/g6/router'; // 折线
// const Util = require('@antv/g6/lib/util/index');
import { uniqueId } from '@/utils/flow'
const MIN_ARROW_SIZE = 3
/**
   * 获取边的 path
   * @internal 供扩展的边覆盖
   * @param  {Array} points 构成边的点的集合
   * @return {Array} 构成 path 的数组
   */
// function getPath(points) {
//     const path = [];
//     Util.each(points, (point, index) => {
//         if (index === 0) {
//             path.push([ 'M', point.x, point.y ]);
//         } else {
//             path.push([ 'L', point.x, point.y ]);
//         }
//     });
//     return path;
// }

const customEdge = {
    init() {
        const dashArray = [
            [0, 1],
            [0, 2],
            [1, 2],
            [0, 1, 1, 2],
            [0, 2, 1, 2],
            [1, 2, 1, 2],
            [2, 2, 1, 2],
            [3, 2, 1, 2],
            [4, 2, 1, 2]
        ];

        const lineDash = [4, 2, 1, 2];
        const interval = 9;
        G6.registerEdge('customEdge', { //曲线
            draw(cfg, group) {
                let sourceNode, targetNode, start, end
                if (typeof(cfg.source) === 'string') {
                    cfg.source = cfg.sourceNode
                }
                if (!cfg.start) {
                    cfg.start = {
                        x: 0,
                        y: 17
                    }
                }
                if (!cfg.end) {
                    cfg.end = {
                        x: 0,
                        y: -17
                    }
                }
                if (!cfg.source.x) {
                    sourceNode = cfg.source.getModel()
                    start = { x: sourceNode.x + cfg.start.x, y: sourceNode.y + cfg.start.y }
                } else {
                    start = cfg.source
                }
                if (typeof(cfg.target) === 'string') {
                    cfg.target = cfg.targetNode
                }
                if (!cfg.target.x) {

                    targetNode = cfg.target.getModel()
                    end = { x: targetNode.x + cfg.end.x, y: targetNode.y + cfg.end.y }
                } else {
                    end = cfg.target
                }

                let path = []
                let hgap_startx, hgap_starty, hgap_endx, hgap_endy, hgap_end2x, hgap_end2y;
                let targetNode_H = Math.abs(end.y - targetNode.y) == targetNode.size[ 1 ] / 2; //目标连线节点是否在图形水平面上
                let sourceNode_H = Math.abs(start.y - sourceNode.y) == sourceNode.size[ 1 ] / 2; //开始节点是否在图形水平面上

                // console.log('FLOG_position', start, sourceNode)
                // console.log('FLOG_H', sourceNode_H, targetNode_H)
                if (sourceNode_H) {
                    let dis = Math.abs(start.y - end.y)
                    if (targetNode.y > sourceNode.y) {
                        hgap_startx = start.x
                        hgap_starty = start.y + 1 / 3 * dis
                    } else {
                        hgap_startx = start.x
                        hgap_starty = start.y - 1 / 3 * dis
                    }
                    if (targetNode_H) {
                        if (targetNode.y > sourceNode.y) {
                            hgap_endx = end.x
                            hgap_endy = start.y + 2 / 3 * dis
                            hgap_end2x = end.x
                            hgap_end2y = end.y - 10
                        } else {
                            hgap_endx = end.x
                            hgap_endy = start.y - 2 / 3 * dis
                            hgap_end2x = end.x
                            hgap_end2y = end.y + 10
                        }
                    } else {
                        let disT = Math.abs(start.x - sourceNode.x)
                        if (targetNode.x > sourceNode.x) {
                            hgap_endx = start.x + 2 / 3 * disT
                            hgap_endy = end.y
                            hgap_end2x = end.x - 10
                            hgap_end2y = end.y
                        } else {
                            hgap_endx = start.x - 2 / 3 * disT
                            hgap_endy = end.y
                            hgap_end2x = end.x + 10
                            hgap_end2y = end.y
                        }
                    }
                } else {
                    let disV = Math.abs(start.x - end.x)
                    if (targetNode.x > sourceNode.x) {
                        hgap_startx = start.x + 1 / 3 * disV
                        hgap_starty = start.y
                    } else {
                        hgap_startx = start.x - 1 / 3 * disV
                        hgap_starty = start.y
                    }
                    if (targetNode_H) {
                        let disH = Math.abs(start.y - end.y)
                        if (targetNode.y > sourceNode.y) {
                            hgap_endx = end.x
                            hgap_endy = start.y + 2 / 3 * disH
                            hgap_end2x = end.x
                            hgap_end2y = end.y - 10
                        } else {
                            hgap_endx = end.x
                            hgap_endy = start.y - 2 / 3 * disH
                            hgap_end2x = end.x
                            hgap_end2y = end.y + 10
                        }
                    } else {
                        if (targetNode.x > sourceNode.x) {
                            hgap_endx = start.x + 2 / 3 * disV
                            hgap_endy = end.y
                            hgap_end2x = end.x - 10
                            hgap_end2y = end.y
                        } else {
                            hgap_endx = start.x - 2 / 3 * disV
                            hgap_endy = end.y
                            hgap_end2x = end.x + 10
                            hgap_end2y = end.y
                        }
                    }
                }
                // if (Math.abs(start.y - targetNode.y) == targetNode.size[ 1 ] / 2) { //目标连线节点在图形水平面上
                //     if (Math.abs(start.x - sourceNode.x) == sourceNode.size[ 0 ] / 2) { //开始节点在图形水平面上
                //         hgap = Math.abs(end.x - start.x)+100
                //     } else {
                //         hgap = Math.abs(end.x - start.x)
                //     }

                // } else { //目标连线节点在图形垂直面上
                //     if (Math.abs(start.x - sourceNode.x) == sourceNode.size[ 0 ] / 2) {
                //         hgap = Math.abs(end.y - start.y) + 100
                //     } else {
                //         hgap = Math.abs(end.y - start.y)
                //     }
                // }

                // if (end.y > start.y) {
                //     hgap_starty = start.y + hgap / (hgap / 50)
                // } else {
                //     hgap_starty = start.y - hgap / (hgap / 50)
                // }

                // if (Math.abs(start.x - sourceNode.x) == sourceNode.size[ 0 ] / 2) { //开始节点在图形水平面上
                //     if (start.x === sourceNode.x + sourceNode.size[ 0 ] / 2) {
                //         hgap_startx = start.x+6
                //     } else {
                //         hgap_startx = start.x-6
                //     }

                // } else {
                //     hgap_startx = start.x
                // }


                // if (end.x > start.x) {
                //     hgap_endx = end.x
                //     hgap_endy = end.x + hgap / (hgap / 50)
                // } else {
                //     hgap_endx = end.x
                //     hgap_endy = end.y - hgap / (hgap / 50)
                // }

                // if (Math.abs(end.x - targetNode.x) == targetNode.size[ 0 ] / 2) { //开始节点在图形水平面上
                //     if (end.x === targetNode.x + targetNode.size[ 0 ] / 2) {
                //         hgap_endx = end.x + hgap / (hgap / 50)
                //     } else {
                //         hgap_endx = end.x - hgap / (hgap / 50)
                //     }
                // } else {
                //     hgap_endx = end.x
                // }


                // if (end.x === targetNode.x + targetNode.size[ 0 ] / 2) {
                //     hgap_end2x = end.x + 12
                //     hgap_end2y = end.y
                // } else if (end.x === targetNode.x - targetNode.size[ 0 ] / 2) {
                //     hgap_end2x = end.x - 12
                //     hgap_end2y = end.y
                // } else {
                //     hgap_end2x = end.x
                //     if (end.y > start.y) {
                //         hgap_end2y = end.y - 4
                //     } else {
                //         hgap_end2y = end.y + 4
                //     }
                // }

                path = [
                        [ 'M', start.x, start.y ],
                        [
                            'C',
                            hgap_startx,
                            hgap_starty,
                            hgap_endx,
                            hgap_endy,
                            hgap_end2x,
                            hgap_end2y
                        ],
                        [
                            'L',
                            end.x,
                            end.y
                        ]
                    ]

                // console.log(9999, path)
                let lineWidth = 1;
                lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE;
                const width = lineWidth * 10 / 3;
                const halfHeight = lineWidth * 4 / 3;
                const radius = lineWidth * 4;

                const endArrowPath = [
                    ['M', -width, halfHeight],
                    ['L', 0, 0],
                    ['L', -width, -halfHeight],
                    ['A', radius, radius, -180, 0, 1, -width, halfHeight],
                    ['Z']
                ];

                const edgemainid = 'edge' + uniqueId();
                const keyShape = group.addShape('path', {
                    attrs: {
                        id: edgemainid,
                        path: path,
                        stroke: '#b8c3ce',
                        lineAppendWidth: 10,
                        endArrow: {
                            path: endArrowPath
                        }
                    }
                });

                if (cfg.condition) {
                    let cl = cfg.flag == '0' ? '' : '函数';
                    group.addShape('text', {
                    attrs: {
                        id: 'edgeText' + uniqueId(),
                        x: end.x - (end.x - start.x) / 2,
                        y: end.y - (end.y - start.y) / 2,
                        text: cl + '  ' + cfg.condition,
                        fill: cfg.textColor ? cfg.textColor : '#000000'
                    }
                    })
                }
                return keyShape
            },
            afterDraw(cfg, group) {
                if (cfg.source.getModel().isDoingStart && cfg.target.getModel().isDoingEnd) {
                    const shape = group.get('children')[0];
                    const length = shape.getTotalLength(); // G 增加了 totalLength 的接口
                    let totalArray = [];
                    for (var i = 0; i < length; i += interval) {
                        totalArray = totalArray.concat(lineDash);
                    }
                    let index = 0;
                    shape.animate({
                        onFrame() {
                            const cfg = {
                                lineDash: dashArray[index].concat(totalArray)
                            };
                            index = (index + 1) % interval;
                            return cfg;
                        },
                        repeat: true
                    }, 3000);
                }
            },
            setState(name, value, item) {
                const group = item.getContainer();
                const shape = group.get("children")[0];
                const selectStyles = () => {
                    shape.attr("stroke", "#6ab7ff");
                };
                const unSelectStyles = () => {
                    shape.attr("stroke", "#b8c3ce");
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
        G6.registerEdge('link-edge', { //虚线直线
            draw(cfg, group) {
                let sourceNode, targetNode, start, end
                if (!cfg.source.x) {
                    sourceNode = cfg.source.getModel()
                    start = { x: sourceNode.x + cfg.start.x, y: sourceNode.y + cfg.start.y }
                } else {
                    start = cfg.source
                }
                if (!cfg.target.x) {
                    targetNode = cfg.target.getModel()
                    end = { x: targetNode.x + cfg.end.x, y: targetNode.y + cfg.end.y }
                } else {
                    end = cfg.target
                }

                let path = []
                path = [
                    ['M', start.x, start.y],
                    ['L', end.x, end.y]
                ]

                const keyShape = group.addShape('path', {
                    attrs: {
                        id: 'edge' + uniqueId(),
                        path: path,
                        stroke: '#1890FF',
                        strokeOpacity: 0.9,
                        lineDash: [5, 5]
                    }
                });
                return keyShape
            },
        });
        // G6.registerEdge("flow-polyline", {
        //     draw(cfg, group) {
        //         let source, target, start, end;
        //         if (!cfg.source.x) {
        //             source = cfg.source.getModel()
        //             start = { x: source.x + cfg.start.x, y: source.y + cfg.start.y }
        //         } else {
        //             start = cfg.source
        //         }
        //         if (!cfg.target.x) {
        //             target = cfg.target.getModel()
        //             end = { x: target.x + cfg.end.x, y: target.y + cfg.end.y }
        //         } else {
        //             end = cfg.target
        //         }
        //         let controlpoints = []
        //         const path = getPath([ start, controlpoints,end ]);

        //         let lineWidth = 1;
        //         lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE;
        //         const width = lineWidth * 10 / 3;
        //         const halfHeight = lineWidth * 4 / 3;
        //         const radius = lineWidth * 4;

        //         const endArrowPath = [
        //             [ 'M', -width, halfHeight ],
        //             [ 'L', 0, 0 ],
        //             [ 'L', -width, -halfHeight ],
        //             [ 'A', radius, radius, -180, 0, 1, -width, halfHeight ],
        //             [ 'Z' ]
        //         ];
        //         const edgemainid = 'edge' + uniqueId();
        //         const keyShape = group.addShape('path', {
        //             attrs: {
        //                 id: edgemainid,
        //                 path: path,
        //                 stroke: '#b8c3ce',
        //                 lineAppendWidth: 10,
        //                 endArrow: {
        //                     path: endArrowPath
        //                 }
        //             }
        //         });
        //         group.addShape("text", {
        //             attrs: {
        //                 text: '添加描述',
        //                 // x: width,
        //                 // y: halfHeight,
        //                 fontSize: 14,
        //                 //textAlign: 'center',
        //                 //textBaseline: 'middle',
        //                 fill: '#0000D9',
        //                 parent: edgemainid
        //             }
        //         });
        //         return keyShape
        //     },
        //     afterDraw(cfg, group) {
        //         if (cfg.source.getModel().isDoingStart && cfg.target.getModel().isDoingEnd) {
        //             const shape = group.get('children')[ 0 ];
        //             const length = shape.getTotalLength(); // G 增加了 totalLength 的接口
        //             let totalArray = [];
        //             for (var i = 0; i < length; i += interval) {
        //                 totalArray = totalArray.concat(lineDash);
        //             }
        //             let index = 0;
        //             shape.animate({
        //                 onFrame() {
        //                     const cfg = {
        //                         lineDash: dashArray[ index ].concat(totalArray)
        //                     };
        //                     index = (index + 1) % interval;
        //                     return cfg;
        //                 },
        //                 repeat: true
        //             }, 3000);
        //         }
        //     },
        //     setState(name, value, item) {
        //         const group = item.getContainer();
        //         const shape = group.get("children")[ 0 ];
        //         const selectStyles = () => {
        //             shape.attr("stroke", "#6ab7ff");
        //         };
        //         const unSelectStyles = () => {
        //             shape.attr("stroke", "#b8c3ce");
        //         };

        //         switch (name) {
        //             case "selected":
        //             case "hover":
        //                 if (value) {
        //                     selectStyles()
        //                 } else {
        //                     unSelectStyles()
        //                 }
        //                 break;
        //         }
        //     }
        // });
    }
}
export default customEdge
