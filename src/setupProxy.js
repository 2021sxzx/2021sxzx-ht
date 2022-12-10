//暂时解决跨域问题
// 只在开发环境下生效。被 npm run build 打包之后该文件无法使用，不会将 /api 开头的请求进行转发
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app){
  app.use(
    '/api',
    createProxyMiddleware({
      //如果后端服务在远程
      //target: 'http://8.134.73.52:5001/',
      //如果后端服务开在本地
      target: 'http://localhost:5001',
      changeOrigin: true,
    })
  )
}
