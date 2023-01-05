import G6 from "@antv/g6";
import { uniqueId } from '@/utils/flow'
const MIN_ARROW_SIZE = 3

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
                let hgap = Math.abs(end.x - start.x)
                if (end.x > start.x) {
                    path = [
                        ['M', start.x, start.y],
                        [
                            'C',
                            start.x,
                            start.y + hgap / (hgap / 50),
                            end.x,
                            end.y - hgap / (hgap / 50),
                            end.x,
                            end.y - 4
                        ],
                        [
                            'L',
                            end.x,
                            end.y
                        ]
                    ]
                } else {
                    path = [
                        ['M', start.x, start.y],
                        [
                            'C',
                            start.x,
                            start.y + hgap / (hgap / 50),
                            end.x,
                            end.y - hgap / (hgap / 50),
                            end.x,
                            end.y - 4
                        ],
                        [
                            'L',
                            end.x,
                            end.y
                        ]
                    ]
                }
                let lineWidth = 1;
                lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE;
                const width = lineWidth * 10 / 3;
                const halfHeight = lineWidth * 4 / 3;
                const radius = lineWidth * 4;
                const endArrowPath = [
                    ['M', -width, halfHeight],
                    ['L', 0, 0],
                    ['L', -width, -halfHeight],
                    ['A', radius, radius, 0, 0, 1, -width, halfHeight],
                    ['Z']
                ];
                console.log('连线', path, endArrowPath);
                const edgemainid = 'edge' + uniqueId();
                const keyShape = group.addShape('path', {
                    attrs: {
                        id: edgemainid,
                        path: path,
                        stroke: '#b8c3ce',
                        lineAppendWidth: 10,
                        endArrow: {
                            path: endArrowPath,
                        }
                    }
                });
                group.addShape("text", {
                    attrs: {
                        text: '添加描述',
                        x: width,
                        y: halfHeight,
                        fontSize: 14,
                        //textAlign: 'center',
                        //textBaseline: 'middle',
                        fill: '#0000D9',
                        parent: edgemainid
                    }
                });
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
        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) { return typeof obj; } : function(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
        var r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function(t) {
                return typeof t === "undefined" ? "undefined" : _typeof(t);
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
            },
            i = function() {
                return function(t, e) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return function(t, e) {
                        var n = [],
                            r = !0,
                            i = !1,
                            o = void 0;
                        try {
                            for (var a, u = t[Symbol.iterator](); !(r = (a = u.next()).done) && (n.push(a.value), !e || n.length !== e); r = !0) {}
                        } catch (t) {
                            i = !0, o = t;
                        } finally {
                            try {
                                !r && u.return && u.return();
                            } finally {
                                if (i) throw o;
                            }
                        }
                        return n;
                    }(t, e);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance");
                };
            }();
        var i_t = n(55),
            o_t = n(445),
            a_t = n(1055),
            u_t = n(1054);
        var o = r({}, i_t.Util, o_t, a_t, u_t);
        var s = { offset: 10, borderRadius: 5 };

        function c(t, e) {
            var n = Math.min(t.minX, e.minX),
                r = Math.min(t.minY, e.minY),
                i = Math.max(t.maxX, e.maxX),
                o = Math.max(t.maxY, e.maxY);
            return { centerX: (n + i) / 2, centerY: (r + o) / 2, minX: n, minY: r, maxX: i, maxY: o, height: o - r, width: i - n };
        }

        function f(t, e) {
            return 2 * Math.abs(t.centerX - e.centerX) < t.width + e.width && 2 * Math.abs(t.centerY - e.centerY) < t.height + e.height;
        }

        function h(t) {
            var e = t.x,
                n = t.y;
            return { centerX: e, centerY: n, minX: e, minY: n, maxX: e, maxY: n, height: 0, width: 0 };
        }

        function l(t, e) {
            return 0 === t.width && 0 === t.height ? t : { centerX: t.centerX, centerY: t.centerY, minX: t.minX - e, minY: t.minY - e, maxX: t.maxX + e, maxY: t.maxY + e, height: t.height + 2 * e, width: t.width + 2 * e };
        }

        function d(t, e) {
            return function(t, e) {
                var n = Math.abs(t.x - e.centerX),
                    r = Math.abs(t.y - e.centerY);
                return n / e.width > r / e.height;
            }(e, t) ? { x: e.x > t.centerX ? t.maxX : t.minX, y: e.y } : { x: e.x, y: e.y > t.centerY ? t.maxY : t.minY };
        }

        function p(t) {
            var e = t.minX,
                n = t.minY,
                r = t.maxX,
                i = t.maxY;
            return [{ x: e, y: n }, { x: r, y: n }, { x: r, y: i }, { x: e, y: i }];
        }

        function g(t, e) {
            var n = t.x,
                r = t.y;
            return n < e.minX || n > e.maxX || r < e.minY || r > e.maxY;
        }

        function v(t, e, n, r) {
            var i = e.x - t.x,
                o = e.y - t.y,
                a = r.x - n.x,
                u = r.y - n.y,
                s = (-o * (t.x - n.x) + i * (t.y - n.y)) / (-a * o + i * u),
                c = (a * (t.y - n.y) - u * (t.x - n.x)) / (-a * o + i * u);
            return s >= 0 && s <= 1 && c >= 0 && c <= 1;
        }

        function m(t, e, n) {
            if (n.width === n.height === 0) return !1;
            var r = p(n),
                o = i(r, 4),
                a = o[0],
                u = o[1],
                s = o[2],
                c = o[3];
            return v(t, e, a, u) || v(t, e, a, c) || v(t, e, u, s) || v(t, e, s, c);
        }

        function y(t) {
            return t = b(t);
        }

        function x(t, e) {
            return [t, { x: t.x, y: e.y }, e];
        }

        function b(t) {
            var e = [],
                n = {};
            return t.forEach(function(t) {
                var e = t.id = t.x + "-" + t.y;
                n[e] = t;
            }), o.each(n, function(t) {
                e.push(t);
            }), e;
        }

        function _(t, e) {
            return Math.abs(t.x - e.x) + Math.abs(t.y - e.y);
        }

        function w(t, e, n, r, i) {
            return _(t, e) + _(t, n) + function(t, e) {
                var n = 0;
                return e.forEach(function(e) {
                    e && (t.x === e.x && (n += -2), t.y === e.y && (n += -2));
                }), n;
            }(t, [e, n, r, i]);
        }

        function S(t, e, n, i, o, a, u) {
            var s = [],
                c = [e],
                f = {},
                h = {},
                l = {};
            h[e.id] = 0, l[e.id] = w(e, n, e);
            var d = {};
            t.forEach(function(t) {
                d[t.id] = t;
            });
            for (var p = function p() {
                    var r,
                        p,
                        g,
                        v = void 0,
                        y = 1 / 0;
                    if (c.forEach(function(t) {
                            l[t.id] < y && (y = l[t.id], v = t);
                        }), v === n) {
                        var x = [];
                        return function t(e, n, r, i) {
                            var o = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0;
                            e.unshift(n[i]), r[i] && r[i] !== i && o <= 100 && t(e, n, r, r[i], o + 1);
                        }(x, d, f, n.id), { v: x };
                    }
                    p = v, (g = (r = c).indexOf(p)) > -1 && r.splice(g, 1), s.push(v),
                        function(t, e, n, r) {
                            var i = [];
                            return t.forEach(function(t) {
                                t !== e && (t.x !== e.x && t.y !== e.y || m(t, e, n) || m(t, e, r) || i.push(t));
                            }), b(i);
                        }(t, v, i, o).forEach(function(t) {
                            if (-1 === s.indexOf(t)) {
                                -1 === c.indexOf(t) && c.push(t);
                                var r = l[v.id] + _(v, t);
                                h[t.id] && r >= h[t.id] || (f[t.id] = v.id, h[t.id] = r, l[t.id] = h[t.id] + w(t, n, e, a, u));
                            }
                        });
                }; c.length;) {
                var g = p();
                if ("object" === (void 0 === g ? "undefined" : r(g))) return g.v;
            }
            return console.error("cannot find path: ", t, e, n), [e, n];
        }

        function M(t, e, n, r, i) {
            var o = n && n.bbox ? n.bbox : h(t),
                a = r && r.bbox ? r.bbox : h(e);
            if (f(o, a)) return y(x(t, e));
            var u = l(o, i),
                s = l(a, i);
            if (f(u, s)) return y(x(t, e));
            var v = d(u, t),
                m = d(s, e),
                _ = function() {
                    var t = [],
                        e = [];
                    (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : []).forEach(function(n) {
                        t.push(n.x), e.push(n.y);
                    });
                    var n = Math.min.apply(Math, t),
                        r = Math.max.apply(Math, t),
                        i = Math.min.apply(Math, e),
                        o = Math.max.apply(Math, e);
                    return { centerX: (n + r) / 2, centerY: (i + o) / 2, maxX: r, maxY: o, minX: n, minY: i, height: o - i, width: r - n };
                }([v, m]),
                w = (c(u, s), c(u, _)),
                M = c(s, _),
                P = [];
            P = (P = P.concat(p(w))).concat(p(M));
            var E = { x: (t.x + e.x) / 2, y: (t.y + e.y) / 2 };
            [_, w, M].forEach(function(t) {
                P = P.concat(function(t, e) {
                    return function(t, e) {
                        return e < t.minX || e > t.maxX ? [] : [{ x: e, y: t.minY }, { x: e, y: t.maxY }];
                    }(t, e.x).concat(function(t, e) {
                        return e < t.minY || e > t.maxY ? [] : [{ x: t.minX, y: e }, { x: t.maxX, y: e }];
                    }(t, e.y));
                }(t, E).filter(function(t) {
                    return g(t, u) && g(t, s);
                }));
            }), [{ x: v.x, y: m.y }, { x: m.x, y: v.y }].forEach(function(t) {
                g(t, u) && g(t, s) && P.push(t);
            }), P.unshift(v), P.push(m);
            var O = S(P = b(P), v, m, o, a, t, e);
            return O.unshift(t), O.push(e), y(O);
        }

        function P(t, e) {
            var n = [],
                r = t[0];
            return n.push("M" + r.x + " " + r.y), t.forEach(function(r, o) {
                var a = t[o + 1],
                    u = t[o + 2];
                if (a && u) {
                    if (function(t, e, n) {
                            return !(t.x === e.x === n.x || t.y === e.y === n.y);
                        }(r, a, u)) {
                        var s = function(t, e, n, r) {
                                var i = _(t, e),
                                    o = _(n, e);
                                return i < r && (r = i), o < r && (r = o), [{ x: e.x - r / i * (e.x - t.x), y: e.y - r / i * (e.y - t.y) }, { x: e.x - r / o * (e.x - n.x), y: e.y - r / o * (e.y - n.y) }];
                            }(r, a, u, e),
                            c = i(s, 2),
                            f = c[0],
                            h = c[1];
                        n.push("L" + f.x + " " + f.y), n.push("Q" + a.x + " " + a.y + " " + h.x + " " + h.y), n.push("L" + h.x + " " + h.y);
                    } else n.push("L" + a.x + " " + a.y);
                } else a && n.push("L" + a.x + " " + a.y);
            }), n.join("");
        }
        G6.registerEdge("flow-polyline", {
            draw(cfg, group) {
                let points, source, target, start, end;
                console.log('进来了aa')
                if (!cfg.source.x) {
                    source = cfg.source.getModel()
                    start = { x: source.x + cfg.start.x, y: source.y + cfg.start.y }
                } else {
                    start = cfg.source
                }
                if (!cfg.target.x) {
                    target = cfg.target.getModel()
                    end = { x: target.x + cfg.end.x, y: target.y + cfg.end.y }
                } else {
                    end = cfg.target
                }
                points = [start, end]
                const i = M(points[0], points[points.length - 1], source, target, 16);
                const path = o.pointsToPolygon(i);
                console.log('进来了aa', path)
                const keyShape = group.addShape('path', {
                    attrs: {
                        id: 'edge' + uniqueId(),
                        path: path,
                        stroke: '#1890FF',
                    }
                });
                return keyShape
            }
        });
        G6.registerEdge("flow-polyline-round", { //折线
            draw(cfg, group) {
                let sourceNode, targetNode, start, end, points
                console.log('进来了')
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

                points = [start, end]
                const path = P(y(M(points[0], points[points.length - 1], sourceNode, targetNode, s.offset)), s.borderRadius)
                console.log('进来了', path)
                const keyShape = group.addShape('path', {
                    attrs: {
                        id: 'edge' + uniqueId(),
                        path: path,
                        stroke: '#1890FF',
                    }
                });
                return keyShape
            }
        });
    }
}
export default customEdge
