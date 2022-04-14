import React from 'react'
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom'
import Login from '../views/login/Login'
import PageContainer from '../views/PageContainer/PageContainer'
import {message} from "antd";
import Cookie from '../utils/Cookie'

export default function indexRouter() {

    // 判断是否已经成功登录
    const isLogin = () => {
        return Cookie.getCookie('loginToken')

        // TODO(zzj):等后台检查是否成功登录的 API 完成
        // const data = {
        //     loginToken: Cookie.getCookie('loginToken'),
        // }
        // api.isLogin(data).then((req, res) => {
        //     if ('成功登录') {
        //         return true
        //     } else {
        //         return false
        //     }
        // }).catch((error) => {
        //     console.log('error isLogin', error)
        //     return false
        // })
    }

    return (
        <HashRouter>
            <Switch>
                <Route path='/login' component={Login}/>
                <Route path='/' render={() => {
                    // TODO(钟卓江): 等验证是否登录的 API 完成后修改
                    if (isLogin()) {
                        // 成功登录就进入后台页面
                        return (<PageContainer/>)
                    } else {
                        // 未登录就重定向到登录页面
                        // return (<PageContainer/>)

                        message.warn('请先登录')
                        return (<Redirect to="/login"/>)
                        // return (<PageContainer/>)
                    }
                }}/>
            </Switch>
        </HashRouter>

    )
}
