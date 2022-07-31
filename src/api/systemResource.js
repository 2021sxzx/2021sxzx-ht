import service from "./http";

const api ={
    GetCpuPercentage(data) {
        return service.request({
            method: "get",
            url: "v1/showCpuPercentage",
            data, //data:data同名可以直接写 data
        });
    },
    GetMemory(data) {
        return service.request({
            method: "get",
            url: "v1/showMemory",
            data, //data:data同名可以直接写 data
        });
    },
    GetDisk(data) {
        return service.request({
            method: "get",
            url: "v1/showDisk",
            data, //data:data同名可以直接写 data
        });
    },
    GetPeopleStatus(){
        return service.request({
            method:'get',
            url:'v1/peopleStatus',
        })
    }
}

export default api
