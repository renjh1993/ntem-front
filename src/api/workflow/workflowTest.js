import request from '@/utils/request'

// 查询列表
export function query(query) {
    return request({
        url: '/lctest/workflowTest/query',
        method: 'get',
        params: query
    })
}

// 查询详细信息
export function getOne(query) {
    return request({
        url: '/lctest/workflowTest/getOne',
        method: 'get',
        params: query
    })
}

// 新增
export function add(data) {
    return request({
        url: '/lctest/workflowTest/create',
        method: 'post',
        data: data
    })
}

// 提交修改已结束流程
export function edit(data) {
    return request({
        url: '/lctest/workflowTest/edit',
        method: 'post',
        data: data
    })
}

// 删除
export function del(data) {
    return request({
        url: '/lctest/workflowTest/remove',
        method: 'post',
        data: data
    })
}

// 更新
export function update(data) {
    return request({
        url: '/lctest/workflowTest/update',
        method: 'post',
        data: data
    })
}

// 存为草稿
export function draft(data) {
    return request({
        url: '/lctest/workflowTest/draft',
        method: 'post',
        data: data
    })
}

// 导出excel
export function exportExcel(query) {
    return request({
        url: '/lctest/workflowTest/export',
        method: 'get',
        params: query
    })
}

export default { query, getOne, add ,del, draft, edit, update, exportExcel }