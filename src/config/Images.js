/*
    Images.js: 图片资源管理
*/
const tyrzDomain = 'https://znzx.rsj.gz.gov.cn/imgs/';//政务云
//const zwyIP = "https://10.196.133.5:5001/imgs/"; // 政务云 ip
//const aliyunIP = "http://8.134.73.52:5001/imgs/"; // 阿里云 ip

const imgPath = tyrzDomain

const Images = {
    // 公共组件
    common: {
        icIcon: imgPath + 'icon.png', // 导航栏(地址栏)图标
        icLogo: imgPath + 'ic_logo.png', // 网站logo
        icDelete: imgPath + 'ic_delete.png', // 删除图标
        icSearch: imgPath + 'ic_search.png', //放大镜图标
        icPlaceholder: imgPath + 'ic_placeholder.png',
        icQrcode: imgPath + 'ic_qrcode.png', // 二维码图标
        icZNKF: imgPath + 'ic_znkf.png',     // 智能客服图标
        icDZJG: imgPath + 'ic_dzjg.png',     // 党政机关图标
        icZFWZZC: imgPath + 'ic_zfwzzc.png',       // 政府网站找错图标
        icYGWA: imgPath + 'ic_ygwa.png',        // 粤公网安图标
        qrcodeApp: imgPath + 'qrcode_app.png',       // 穗好办APP二维码
        qrcodeWeb: imgPath + 'qrcode_web.png',       // 人社局官网二维码
        qrcodeWechat: imgPath + 'qrcode_wechat.png'     // 人社局微信公众号二维码
    },

    // 首页
    home: {
        icGRYW: imgPath + 'ic_gryw.png',       // 个人业务图标
        icFRYW: imgPath + 'ic_fryw.png',        // 法人业务图标
        icLDBZ: imgPath + 'ic_ldbz.png',     // 劳动保障图标
        icRSRC: imgPath + 'ic_rsrc.png',        // 人事人才图标
        icSHBX: imgPath + 'ic_shbx.png',       // 社会保险图标
        icJYCY: imgPath + 'ic_jycy.png',        // 就业创业图标
        bannerPC: imgPath + 'banner_pc.png',  // pc端轮播图 /但是大小好像弄反了
        bannerMB: imgPath + 'banner_mb.png',  // 移动端轮播图
        // testImg: [
        //     require('./imgs/banner_mb.png').default,
        //     imgPath + 'ic_shbx.png'
        // ]
    }
}

export default Images
