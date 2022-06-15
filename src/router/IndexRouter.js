import React, { useEffect, useState } from 'react'
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom'
import Login from '../views/login/Login'
import PageContainer from '../views/PageContainer/PageContainer'
import {message} from "antd";
import api from  '../api/login'

export default function indexRouter() {
  const [isLogin, setIsLogin] = useState(true);
  useEffect(async () => {
    const _isLogin = await api.IsLogin();
    setIsLogin(_isLogin);
  }, []);
    return (
        <HashRouter>
            <Switch>
                <Route path='/login' component={Login}/>
                <Route path='/' render={() => {
                    if (isLogin) {
                        // 成功登录就进入后台页面
                        return (<PageContainer/>)
                    } else {
                        // 未登录就重定向到登录页面
                        message.warn('请先登录')
                        return (<Redirect to="/login"/>)
                    }
                }}/>
            </Switch>
        </HashRouter>

    )
}
