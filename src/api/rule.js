import service from "./http";
/**
 * 获取验证码
 */

const api ={
    GetRuleTree(data) {
        return service.request({
            method: "get",
            url: "/v1/getRuleTree/",
            data, //data:data同名可以直接写 data
        });
    },
    GetRegionTree(data){
        return service.request({
            method: "get",
            url: "/v1/getRegionTree/",
            data, //data:data同名可以直接写 data
        });
    },
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
            data,
        })
    },
    GetRulePath(data){
        return service.request({
            method: "post",
            url: "/v1/getRulePath",
            data,
        })
    },
    GetRegionPath(data){
        return service.request({
            method: "post",
            url: "/v1/getRegionPath",
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
    CreateRules(data){
        return service.request({
            method: "post",
            url: "/v1/createRules",
            data
        })
    }
}

export default api