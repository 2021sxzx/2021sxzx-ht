import service from "./http";
/**
 * 获取验证码
 */

const api ={
    GetSystemLog(data) {
        return service.request({
            method: "get",
            url: "v1/allSystemLogDetail",
            data, //data:data同名可以直接写 data
        });
    }
    // SearchComment(data){
    //     return service.request({
    //         method: "post",
    //         url: "/v1/searchComment/",
    //         data, //data:data同名可以直接写 data
    //     });
    // }
}

export default api