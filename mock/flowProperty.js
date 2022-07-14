const flow = {
  'name': '测试流程',
  'nodes': [{
    'type': 'node',
    'node_type': 'start',
    'size': '72*72',
    'shape': 'flow-circle',
    'color': '#FA8C16',
    'label': '开始',
    'x': 468,
    'y': 61,
    'id': '01729835',
    'index': 0
  }, {
    'type': 'node',
    'node_type': 'start',
    'size': '80*48',
    'shape': 'flow-rect',
    'color': '#1890FF',
    'label': 'Normal',
    'x': 468,
    'y': 201.5,
    'id': 'b69121d6',
    'index': 1
  }, {
    'type': 'node',
    'node_type': 'start',
    'size': '80*72',
    'shape': 'flow-rhombus',
    'color': '#13C2C2',
    'label': 'Decision',
    'x': 468,
    'y': 339.5,
    'id': 'a459eb24',
    'index': 2
  }, {
    'type': 'node',
    'node_type': 'start',
    'size': '80*48',
    'shape': 'flow-rect',
    'color': '#1890FF',
    'label': 'Normal',
    'x': 672.3,
    'y': 201.6,
    'id': '18e81721',
    'index': 3
  }, {
    'type': 'node',
    'node_type': 'start',
    'size': '72*72',
    'shape': 'flow-circle',
    'color': '#FA8C16',
    'label': 'end',
    'x': 468,
    'y': 502.00000000000006,
    'id': '03511b2c',
    'index': 9
  }],
  'edges': [{
    'source': '01729835',
    'sourceAnchor': 2,
    'target': 'b69121d6',
    'targetAnchor': 0,
    'id': '070785c1',
    'index': 4
  }, {
    'source': 'b69121d6',
    'sourceAnchor': 2,
    'target': 'a459eb24',
    'targetAnchor': 0,
    'id': 'a3bbe682',
    'index': 5
  }, {
    'source': 'a459eb24',
    'sourceAnchor': 1,
    'target': '18e81721',
    'targetAnchor': 2,
    'id': '25f2209d',
    'index': 6
  }, {
    'source': '18e81721',
    'sourceAnchor': 3,
    'target': 'b69121d6',
    'targetAnchor': 1,
    'id': 'd3a887fa',
    'index': 7
  }, {
    'source': 'a459eb24',
    'sourceAnchor': 2,
    'target': '03511b2c',
    'targetAnchor': 0,
    'id': '494f8cc4',
    'index': 8
  }]
}

module.exports = [
  {
    url: '/dmip_flow/flow/saveFlowData',
    type: 'post',
    response: config => {
      return {
        code: 200
      }
    }
  },
  {
    url: '/dmip_flow/flow/getFlowData',
    type: 'get',
    response: config => {
      return {
        code: 200,
        data: flow
      }
    }
  }
]
