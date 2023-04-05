import React, {Suspense, lazy, useEffect, useRef, useState} from 'react'
import {HashRouter, Route, Switch} from 'react-router-dom'
// import Login from '../views/login/Login'
// import PageContainer from '../views/PageContainer/PageContainer'
import {message, Modal} from "antd";
import api from '../api/login'
import {ExclamationCircleOutlined} from "@ant-design/icons";

// 懒加载
const Login = lazy(() => {
    return import('../views/login/Login')
})
const PageContainer = lazy(() => {
    return import('../views/PageContainer/PageContainer')
})

const {confirm} = Modal

export const loginStateContext = React.createContext({})

export default function indexRouter() {
    const [loginState, setLoginState] = useState('loading')

    // 当前是否是登录页面。不使用 useState 的原因是没有根据 isLoginPage 的变化重新渲染组件的必要
    const shouldCheckLoginState = useRef(false)

    // 根据 url 的变化来统一更新 isLoginPage
    useEffect(() => {
        // 只有登录页面不需要进行身份验证
        shouldCheckLoginState.current = (location.hash === '#/login')
    }, [shouldCheckLoginState, location.hash])

    // 每次访问（不同的） url 的时候，如果不是在登录页面，就主动验证一次登录状态，并在服务器更新登录过期时间
    useEffect(() => {
        if (shouldCheckLoginState.current === false) {
            checkLoginState()
        }
    }, [location.hash])

    // 根据登录状态 loginState 的变化，来调整系统的行为。
    useEffect(() => {
        switch (loginState) {
            case 'login': // 登录状态
            case 'loading': // 初始化状态
                break

            case 'logout':// 登出状态
                // 如果当前页面不是登录页面，就显示超时登出的对话框
                if (shouldCheckLoginState.current === false) {
                    confirm({
                        title: '您已登出，如需要请重新登录',
                        icon: <ExclamationCircleOutlined/>,
                        content: '',
                        okText: '确认',
                        onOk() {
                            // 清除缓存并且重定向到登录页面
                            api.clearStorageAndRedirect()
                        },
                        cancelButtonProps: {
                            style: {
                                display: 'none',
                            }
                        }
                    })
                }
                break

            default:
                // 如果是未知的状态，重定向到登录页面
                message.error('登录状态发生错误，请重新登录')
                api.clearStorageAndRedirect()
        }
    }, [loginState])

    /**
     * 检查该用户的登录状态
     * @return {Promise<unknown>}
     */
    async function checkLoginState() {
        return new Promise((resolve, reject) => {
            api.IsLogin().then((res) => {
                // 获取登录状态，如果登录状态有改变就更新登录状态
                if (res === true && loginState !== 'login') {
                    setLoginState('login')
                } else if (res === false && loginState !== 'logout') {
                    setLoginState('logout')
                }
                resolve(res)
            }).catch((err) => {
                setLoginState('logout')
                reject(err)
            })
        })
    }

    return (
        <HashRouter>
            <loginStateContext.Provider value={{setLoginState}}>
                <Switch>
                    <Suspense fallback={<div>loading</div>}>
                        {/*<Route path='/login' component={Login} setLoginState={setLoginState}/>*/}
                        {/*<Route path='/' render={() => {*/}
                        {/*    switch (loginState) {*/}
                        {/*        case 'login':// 登录状态*/}
                        {/*            return <PageContainer/>*/}
                        {/*        case 'logout':// 登出状态*/}
                        {/*            return <div>logout</div>*/}
                        {/*        case 'loading':// 初始化状态*/}
                        {/*            return <div>正在验证登录状态，请稍等...</div>*/}
                        {/*        default:*/}
                        {/*            return <div>error</div>*/}
                        {/*    }*/}
                        {/*}}/>*/}
                        <Switch>
                            <Route path='/login' component={Login} setLoginState={setLoginState}/>
                            <Route path='/' render={() => {
                                switch (loginState) {
                                    case 'login':// 登录状态
                                        return <PageContainer/>
                                    case 'logout':// 登出状态
                                        return <div>logout</div>
                                    case 'loading':// 初始化状态
                                        return <div>正在验证登录状态，请稍等...</div>
                                    default:
                                        return <div>error</div>
                                }
                            }
                            }/>
                        </Switch>
                    </Suspense>
                </Switch>
            </loginStateContext.Provider>
        </HashRouter>
    )
}
