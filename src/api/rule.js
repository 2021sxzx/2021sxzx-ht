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
            methods: "get",
            url: "/v1/getItemRules/",
            data,
        })
    },
    GetItemByUniId(data){
        return service.request({
            methods: "get",
            url: "/v1/getItemByUniId/",
            data,
        })
    },
    CreateRules(data){
        return service.request({
            methods: "get",
            url: "/v1/createRules/",
            data,
        })
    },
    DeleteRules(data){
        return service.request({
            methods: "get",
            url: "/v1/deleteRules/",
            data,
        })
    },
    GetItemsByRuleId(data){
        return service.request({
            methods: "get",
            url: "/v1/getItemsByRuleId/",
            data,
        })
    }
}

export default api