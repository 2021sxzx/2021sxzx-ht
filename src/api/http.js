import axios from 'axios'
import api from './login'
import {notification} from 'antd'

// 对axios请求进行二次封装，timeout是没执行成功就执行错误消息
/**README by lhy
 * 想改 baseURL 的朋友注意了，不要改，除非你特别明白自己在做什么。
 * 这里旧版本代码的设想是根据不同的环境来设置 baseURL。
 * 比如开发环境就使用本地或者阿里云的 IP，生产环境就用政务云的 IP。
 * 但实际情况是，只要使用非本机地址就会产生跨域问题！
 * 要使用不同的地址，在开发环境中应该使用 http-proxy-middleware，
 * 在生产环境应该交由诸如 Nginx 之类的服务器处理，
 * 所以在代码中编写的 baseURL 只能是本机地址。
 */
const instance = axios.create({
  baseURL: '/api',
  timeout: 100000,
  withCredentials: true
})
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    let headers = config.headers
    //localStorage进行身份验证
    headers.userId = localStorage.getItem('_id') ? localStorage.getItem('_id') : ''
    console.log('请求拦截器', config)
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    console.log('响应拦截器', response)
    //如果用户状态突然被管理员切换至未激活
    // if(response.data.loginstate == "loginout")
    // {
    //     guideApi.clearStorageAndRedirect()
    //     notification.error({
    //         maxCount:1,
    //         duration:0,
    //         message:"账号未激活请联系管理员"
    //     })
    // }
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // console.log("MISTAKE")
    if (error.response.status === 401) {
      api.clearStorageAndRedirect()
      notification.error({
        key: 'errorkey',
        maxCount: 1,
        duration: 0,
        message: '账号未激活请联系管理员'
      })
    }
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default instance

