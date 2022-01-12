import service from "./http";
/**
 * 获取验证码
 */

const api ={
    GetComment(data) {
        return service.request({
            method: "get",
            url: "/v1/log/",
            data, //data:data同名可以直接写 data
        });
    },
    async getLogparams(){
        return service.get('/v1/logparam')
    },
    SearchLog(data){
        return service.request({
            method: "post",
            url: "/v1/searchLog/",
            data, //data:data同名可以直接写 data
        });
    }
}

export default api