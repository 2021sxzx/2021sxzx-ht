import service from './http'

const request = (method, url, data) => service.request({method, url, data})
export default {
  SiteSettings: data => request('get', 'v1/site-settings', data),
  CoreSettings: data => request('get', 'v1/core-settings', data),
  ChangeCoreSettings: data => request('patch', 'v1/core-settings', data),
  GetNetworkStatus: data => request('get', 'v1/interface/NetworkStatus', data),
  SetInterfaceUrl: data => request('patch', 'v1/interface', data),
  GetInterfaceUrl: data => request('get', 'v1/interface', data),
  GetLogPath: data => request('get', '/v1/log-path', data),
  GetChartData: type => service.request({method: 'get', url: '/v1/chart-data/', params: {type}}),
  // todo 以上这些移动到systemMetadata
  getTel: () => request('get', '/v1/get-tel'),
  setTel: data => request('post', '/v1/set-tel', data)
}