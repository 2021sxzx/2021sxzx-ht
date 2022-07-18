import axios from './http';

const api = {
    getTopHeaderData() {
        return axios.request({
            method: 'get',
            url: '/v1/personal'
        });
    },
    //梦网科技的接口
    modifyPassword(data){
        console.log(data)
        return axios.request({
            method: 'post',
            url: '/v2/modifyPwd',
            data:data
        });
    }
}

export default api;
