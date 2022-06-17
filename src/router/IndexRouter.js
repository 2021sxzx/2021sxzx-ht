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
                        return <PageContainer/>
                    } else {
                        // 未登录就重定向到登录页面
                        setIsLogin(true);
                        message.warn('登录已过期，请重新登录')
                        // 清除本地保存的所有信息
                        localStorage.clear()
                        // 清除会话缓存
                        sessionStorage.clear()
                        return <Redirect to="/login"/>

                    }
                }}/>
            </Switch>
        </HashRouter>

    )
}
