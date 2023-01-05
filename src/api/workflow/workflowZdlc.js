import request from '@/utils/request'

// 查询列表
export function query(query) {
    return request({
        url: '/zdlc/workflowZdlc/query',
        method: 'get',
        params: query
    })
}

// 查询详细信息
export function getOne(query) {
    return request({
        url: '/zdlc/workflowZdlc/getOne',
        method: 'get',
        params: query
    })
}

// 新增
export function add(data) {
    return request({
        url: '/zdlc/workflowZdlc/create',
        method: 'post',
        data: data
        
    })
}
// 新增
export function addByDraft(data) {
    return request({
        url: '/zdlc/workflowZdlc/createByDraft',
        method: 'post',
        data: data
        
    })
}
// 提交修改已结束流程
export function edit(data) {
    return request({
        url: '/zdlc/workflowZdlc/edit',
        method: 'post',
        data: data
    })
}

// 删除
export function del(data) {
    return request({
        url: '/zdlc/workflowZdlc/remove',
        method: 'post',
        data: data
    })
}

// 更新
export function update(data) {
    return request({
        url: '/zdlc/workflowZdlc/update',
        method: 'post',
        data: data
    })
}

// 存为草稿
export function draft(data) {
    return request({
        url: '/zdlc/workflowZdlc/draft',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data',
           
        }
    })
}

// 导出excel
export function exportExcel(query) {
    return request({
        url: '/zdlc/workflowZdlc/export',
        method: 'get',
        params: query
    })
}

export default { query, getOne, add ,del, draft, update, addByDraft,exportExcel }