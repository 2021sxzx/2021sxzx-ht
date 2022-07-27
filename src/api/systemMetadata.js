import service from './http'

const request = (method, url, data) => service.request({method, url, data})
export default {
  CoreSettings: data => request('get', 'v1/core-settings', data),
  ChangeCoreSettings: data => request('patch', 'v1/core-settings', data),
  GetNetworkStatus: data => request('get', 'v1/interface/NetworkStatus', data),
  SetInterfaceUrl: data => request('patch', 'v1/interface', data),
  GetInterfaceUrl: data => request('get', 'v1/interface', data),
  GetLogPath: data => request('get', '/v1/log-path', data),
  GetChartData: type => service.request({method: 'get', url: '/v1/chart-data/', params: {type}}),
  websiteSettings: data => request('post', 'v1/website-settings-upload', data)
}