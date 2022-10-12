import service from "./http";

const api = {
    // 事项指南管理
    GetItemGuide(data) {
        return service.request({
            method: "post",
            url: "/v1/getItemGuide",
            data
        })
    },
    GetItemGuides(data) {
        let dataPlus = data
        dataPlus['user_id'] = localStorage.getItem('_id')
        return service.request({
            method: "post",
            url: "/v1/getItemGuides",
            data: dataPlus
        })
    },
    CreateItemGuide(data) {
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
    DeleteItemGuides(data) {
        return service.request({
            method: "post",
            url: "/v1/deleteItemGuides",
            data
        })
    },
    updateItemGuide(data) {
        return service.request({
            method: "post",
            url: "/v1/updateItemGuide",
            data
        })
    },
}

export default api
