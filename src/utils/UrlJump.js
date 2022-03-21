
const UrlJump = {
    // 有历史痕迹地跳转到目标 url，可以返回上一页
    goto(url) {
        window.location=url
    },

    // 无历史痕迹地跳转到目标 url，不能反回上一页
    replace(url){
        window.location.replace(url)
    },

    /**
     * 将历史堆栈中的指针移动 n 个条目。i.e.：
     * -1 为退回到上一页;1 为前进到下一页
     * @param n number
     */
    go(n=-1){
        window.history.go(n)
    }
}


export default UrlJump