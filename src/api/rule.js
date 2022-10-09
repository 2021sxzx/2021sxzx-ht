import service from "./http";

/**
 * 获取验证码
 */

const api = {
    // 业务规则管理
    CreateRules(data) {
        return service.request({
            method: "post",
            url: "/v1/createRules",
            data
        })
    },
    DeleteRules(data) {
        return service.request({
            method: "post",
            url: "/v1/deleteRules",
            data
        })
    },
    UpdateRules(data) {
        return service.request({
            method: "post",
            url: "/v1/updateRules",
            data
        })
    },
    GetRules(data) {
        return service.request({
            method: "post",
            url: "/v1/getRules",
            data
        })
    },
    GetRulePaths(data) {
        return service.request({
            method: "post",
            url: "/v1/getRulePaths",
            data
        })
    },
    // 区划规则管理
    CreateRegions(data) {
        return service.request({
            method: "post",
            url: "/v1/createRegion",
            data
        })
    },
    DeleteRegions(data) {
        return service.request({
            method: "post",
            url: "/v1/deleteRegions",
            data
        })
    },
    UpdateRegions(data) {
        return service.request({
            method: "post",
            url: "/v1/updateRegions",
            data
        })
    },
    GetRegions(data) {
        return service.request({
            method: "post",
            url: "/v1/getRegions",
            data
        })
    },
    GetRegionPaths(data) {
        return service.request({
            method: "post",
            url: "/v1/getRegionPaths",
            data
        })
    },
    // 事项指南管理
    GetItemGuide(data) {
        return service.request({
            method: "post",
            url: "/v1/getItemGuide",
            data
        })
    },
    GetItemGuides(data) {
        let dataPlus = data
        dataPlus['user_id'] = localStorage.getItem('_id')
        return service.request({
            method: "post",
            url: "/v1/getItemGuides",
            data: dataPlus
        })
    },
    CreateItemGuide(data) {
        return service.request({
            method: "post",
            url: "/v1/createItemGuide",
            //processData: false,
            headers: {
                contentType: 'multipart/form-data'
            },
            data
        })
    },
    DeleteItemGuides(data) {
        return service.request({
            method: "post",
            url: "/v1/deleteItemGuides",
            data
        })
    },
    updateItemGuide(data) {
        return service.request({
            method: "post",
            url: "/v1/updateItemGuide",
            data
        })
    },
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
    AddAuditAdvise(data) {
        return service.request({
            method: "post",
            url: "/v1/addAuditAdvise",
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
    // 初始化通用
    GetUserRank(data) {
        return service.request({
            method: "post",
            url: "/v1/getUserRank",
            data
        })
    },
    GetCheckResult() {
        return service.request({
            method: "get",
            url: "/v1/getCheckResult"
        })
    },
    UpdateCheckResult(data) {
        return service.request({
            method: "post",
            url: "/v1/updateCheckResult",
            headers: {
                'Content-Type': 'application/json'
            },
            data
        })
    },
    GetEveryItemStatusCount() {
        return service.request({
            method: "get",
            url: "/v1/getEveryItemStatusCount"
        })
    },
    GetItemUsers(data) {
        return service.request({
            method: "post",
            url: "/v1/getItemUsers",
            data
        })
    },
    GetUserNameById(data) {
        return service.request({
            method: "post",
            url: "/v1/getUserNameById",
            data
        })
    },
    GetServerIP() {
        return (service.defaults.baseURL === '/api' ? '/api' : 'http://8.134.73.52:5001')
    },
    // 绑定事项时根据选择的事项规则来推荐相关的事项规则
    GetRecommend(data) {
        return service.request({
            method: "post",
            url: "/v1/getRecommend",
            data
        })
    }
}

export default api
