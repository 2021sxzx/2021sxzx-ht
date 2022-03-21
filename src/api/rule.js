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
    GetRegions(data){
        return service.request({
            method: "post",
            url: "/v1/getRegions",
            data
        })
    }
}

export default api