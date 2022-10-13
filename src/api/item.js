import service from "./http";

const api = {
    // 事项流程管理
    CreateItems(data) {
        return service.request({
            method: "post",
            url: "/v1/createItems",
            data
        })
    },
    DeleteItems(data) {
        return service.request({
            method: "post",
            url: "/v1/deleteItems",
            data
        })
    },
    UpdateItems(data) {
        return service.request({
            method: "post",
            url: "/v1/updateItems",
            data
        })
    },
    // 根据具体条件获取筛选过的事项，data 里面的内容根据具体查询要求选填
    GetItems(data) {
        let dataPlus = data
        dataPlus['user_id'] = localStorage.getItem('_id')
        return service.request({
            method: "post",
            url: "/v1/getItems",
            data: dataPlus
        })
    },
    ChangeItemStatus(data) {
        return service.request({
            method: "post",
            url: "/v1/changeItemStatus",
            data
        })
    },
    GetItemGuideAndAuditAdvises(data) {
        return service.request({
            method: "post",
            url: "/v1/getItemGuideAndAuditAdvises",
            data
        })
    },
    // 事项状态表
    GetItemStatusScheme(data) {
        return service.request({
            method: "get",
            url: "/v1/getItemStatusScheme",
            data
        })
    },
}

export default api
