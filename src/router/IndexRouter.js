import React, {useState} from 'react'
import {HashRouter, Route, Switch} from 'react-router-dom'
import Login from '../views/login/Login'
import PageContainer from '../views/PageContainer/PageContainer'
import {message} from "antd";
import api from '../api/login'

export const loginStateContext = React.createContext({})

export default function indexRouter() {
    const [loginState, setLoginState] = useState('loading');

    return (
        <HashRouter>
            <loginStateContext.Provider value={{setLoginState}}>
                <Switch>
                    <Route path='/login' component={Login} setLoginState={setLoginState}/>
                    <Route path='/' render={() => {
                        // 进入该 url 先判断是否处于登录状态
                        api.IsLogin().then((res) => {
                            // 获取登录状态，如果登录状态有改变就更新登录状态
                            if (res === true && loginState !== 'login') {
                                setLoginState('login')
                            } else if (res === false && loginState !== 'logout') {
                                setLoginState('logout')
                            }
                        }).catch(() => {
                            setLoginState('logout')
                        })

                        if (loginState === 'login') {
                            // 成功登录就进入后台页面
                            return <PageContainer/>
                        } else if (loginState === 'logout') {
                            // 未登录就重定向到登录页面
                            message.warn('登录已过期，请重新登录')
                            api.clearStorageAndRedirect()
                        } else if (loginState === 'loading') {
                            // 如果是刚初始化登录状态，就先等待 IsLogin 的响应
                            // message.info('正在验证登录状态，请稍等')
                            return <>正在验证登录状态，请稍等...</>
                        } else {
                            // 如果是未知的状态，重定向到登录页面
                            message.error('登录状态发生错误，请重新登录')
                            api.clearStorageAndRedirect()
                        }
                    }}/>
                </Switch>
            </loginStateContext.Provider>
        </HashRouter>
    )
}
