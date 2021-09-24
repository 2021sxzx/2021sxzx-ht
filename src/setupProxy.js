//暂时解决跨域问题
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app){
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
    })
  )
}