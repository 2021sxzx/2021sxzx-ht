import service from './http'

const request = (method, url, data) => service.request({method, url, data})
export default {
  getTel: () => request('get', '/v1/get-tel'),
  setTel: data => request('post', '/v1/set-tel', data)
}