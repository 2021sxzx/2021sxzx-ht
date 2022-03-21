import React from 'react'

import {Layout} from 'antd';

import LoginForm from "./components/LoginForm";
import PageFooter from "./components/PageFooter";

const {Header, Footer, Content} = Layout;

export default function Login() {
    return (
        <div>
            <Layout>
                {/*页头*/}
                <Header>
                    <font color={"white"}>广州人社局智能咨询平台</font>
                </Header>

                {/*登录页主体内容*/}
                <Content>
                    <LoginForm/>
                </Content>

                {/*TODO(钟卓江):将样式移到scss文件中*/}
                {/*页尾*/}
                <Footer style={{background: '#FFFF'}}>
                    <PageFooter/>
                </Footer>
            </Layout>
        </div>
    )
}
