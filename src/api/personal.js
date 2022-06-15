import axios from './http';

const api = {
  getTopHeaderData () {
    return axios.request({
      method: 'get',
      url: '/v1/personal/'
    });
  }
}

export default api;