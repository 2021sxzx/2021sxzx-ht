import React from 'react'
import {Button, Layout, message} from 'antd'
import UrlJump from "../../../utils/UrlJump";
import Cookie from "../../../utils/Cookie";

const {Header} = Layout;

export default function TopHeader() {
    const logout = ()=>{
        message.success('您已成功登出')
        UrlJump.goto('#/login')
        // 清除 token
        Cookie.setCookie('loginToken', '',-1)
        // 清除角色
        Cookie.setCookie('roleName', '',-1)
        // TODO（钟卓江）：需要 server 端给个登出的 API
    }

    return (
        <Header style={{background: '#fff', padding: 0}}>
            <div style={{position: "absolute", right: 0, margin: "auto 30px"}}>
                <Button onClick={logout}>logout</Button>
            </div>
        </Header>
    )
}
