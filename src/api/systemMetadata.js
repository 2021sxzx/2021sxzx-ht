import service from './http'

const request = (method, url, data) => service.request({method, url, data})
export default {
  // webSiteLogo: data => request('post', 'v1/websitelogo-upload', data),
  // addressBarIcon: data => request('post', 'v1/addressbaricon-upload', data),
  // backstageLogo: data => request('post', '/v1/backstagelogo-upload', data),
  // officialQRCode: data => request('post', '/v1/official-qrcode-upload', data),
  // wechatOfficialAccountQRCode: data => request('post', '/v1/wechat-official-account-qrcode-upload', data),
  // appQRCode: data => request('post', '/v1/app-qrcode-upload', data),
  websiteSettings: data => request('post', 'v1/website-settings-upload', data)
}