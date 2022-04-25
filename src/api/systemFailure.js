import service from "./http";

const api ={
    CreateSystemFailure(data) {
        return service.request({
            method: "post",
            url: "v1/create-system-failure",
            data, //data:data同名可以直接写 data
        });
    },
    GetSystemFailure(data) {
        return service.request({
            method: "get",
            url: "v1/failure",
            data
        })
    },
    DeleteSystemFailure(data) {
        return service.request({
            method: "post",
            url: "v1/delete-system-failure",
            data
        })
    }
}

export default api