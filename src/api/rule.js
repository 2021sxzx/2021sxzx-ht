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
    }
}

export default api