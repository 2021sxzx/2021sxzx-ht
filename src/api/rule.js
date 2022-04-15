import service from "./http";
/**
 * 获取验证码
 */

const api ={
    // 数据层
    GetRuleTree(data) {
        return service.request({
            method: "get",
            url: "/v1/getRuleTree/",
            data
        });
    },
    GetRegionTree(data){
        return service.request({
            method: "get",
            url: "/v1/getRegionTree/",
            data
        });
    },
    // 暂留
    GetItemRules(data){
        return service.request({
            method: "post",
            url: "/v1/getItemRules/",
            data,
        })
    },
    DeleteItemRules(data){
        return service.request({
            method: "post",
            url: "/v1/deleteItemRules/",
            data
        })
    },
    CreateItemRules(data){
        return service.request({
            method: "post",
            url: "/v1/createItemRules",
            data
        })
    },
    UpdateItemRules(data){
        return service.request({
            method: "post",
            url: "/v1/updateItemRules",
            data
        })
    },
    // 业务规则管理
    CreateRules(data){
        return service.request({
            method: "post",
            url: "/v1/createRules",
            data
        })
    },
    DeleteRules(data){
        return service.request({
            method: "post",
            url: "/v1/deleteRules",
            data
        })
    },
    UpdateRules(data){
        return service.request({
            method: "post",
            url: "/v1/updateRules",
            data
        })
    },
    GetRules(data){
        return service.request({
            method: "post",
            url: "/v1/getRules",
            data
        })
    },
    CreateRegions(data){
        return service.request({
            method: "post",
            url: "/v1/createRegion",
            data
        })
    },
    DeleteRegions(data){
        return service.request({
            method: "post",
            url: "/v1/deleteRegions",
            data
        })
    },
    UpdateRegions(data){
        return service.request({
            method: "post",
            url: "/v1/updateRegions",
            data
        })
    },
    GetRegions(data){
        return service.request({
            method: "post",
            url: "/v1/getRegions",
            data
        })
    },
    GetItemGuide(data){
        return service.request({
            method: "post",
            url: "/v1/getItemGuide",
            data
        })
    },
    GetItemGuides(data){
        return service.request({
            method: "post",
            url: "/v1/getItemGuides",
            data
        })
    },
    CreateItemGuide(data){
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
    DeleteItemGuides(data){
        return service.request({
            method: "post",
            url: "/v1/deleteItemGuides",
            data
        })
    },
    updateItemGuide(data){
        return service.request({
            method: "post",
            url: "/v1/updateItemGuide",
            data
        })
    },
    CreateItems(data){
        return service.request({
            method: "post",
            url: "/v1/createItems",
            data
        })
    },
    DeleteItems(data){
        return service.request({
            method: "post",
            url: "/v1/deleteItems",
            data
        })
    },
    UpdateItems(data){
        return service.request({
            method: "post",
            url: "/v1/updateItems",
            data
        })
    },
    GetItems(data){
        return service.request({
            method: "post",
            url: "/v1/getItems",
            data
        })
    },
    GetItemStatusScheme(data){
        return service.request({
            method: "get",
            url: "/v1/getItemStatusScheme",
            data
        })
    },
    ChangeItemStatus(data){
        return service.request({
            method: "post",
            url: "/v1/changeItemStatus",
            data
        })
    },
    GetItemGuideAndAuditAdvises(data){
        return service.request({
            method: "post",
            url: "/v1/getItemGuideAndAuditAdvises",
            data
        })
    },
    AddAuditAdvise(data){
        return service.request({
            method: "post",
            url: "/v1/addAuditAdvise",
            data
        })
    },
    GetUserRank(data){
        return service.request({
            method: "post",
            url: "/v1/getUserRank",
            data
        })
    }
}

export default api