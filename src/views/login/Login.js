import React from 'react'

import {Layout} from 'antd';

import LoginForm from "./components/LoginForm";
import PageFooter from "./components/PageFooter";
import style from './login.module.scss'

const {Header, Footer, Content} = Layout;

export default function Login() {
    return (
        <div>
            <Layout className={style.loginLayout}>
                {/*页头*/}
                <Header>
                    <font color={"white"}>广州人社局智能咨询平台</font>
                </Header>

                {/*登录页主体内容*/}
                <Content className={style.container}>
                    <LoginForm/>
                </Content>

                {/*页尾*/}
                <Footer className={style.footer}>
                    <PageFooter/>
                </Footer>
            </Layout>
        </div>
    )
}
