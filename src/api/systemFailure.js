import service from "./http";

const api ={
    CreateSystemFailure(data) {
        return service.request({
            method: "post",
            url: "v1/createSystemFailure",
            data, //data:data同名可以直接写 data
        });
    },

}

export default api