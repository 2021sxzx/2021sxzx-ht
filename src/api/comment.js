import service from "../../src/utils/request";
/**
 * 获取验证码
 */
export function GetComment(data) {
    return service.request({
        method: "get",
        url: "/allcomment/",
        data, //data:data同名可以直接写 data
    });
}