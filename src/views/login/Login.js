import React from 'react'

import {Layout} from 'antd';

import LoginForm from "./components/LoginForm";
import PageFooter from "./components/PageFooter";

const {Header, Footer, Content} = Layout;

//TODO（钟卓江）：和服务端API对接（现在还没做好）

export default function Login() {
    // /**
    //  * 登录失败的提示信息，默认为空
    //  */
    // const [notice, setNotice] = useState('')
    // /**
    //  * 控制属于哪个标签页/登录方式
    //  * 账号密码登录：’account‘
    //  * 手机登录：’mobile‘
    //  */
    // const [type, setType] = useState('mobile')
    //
    // /**
    //  * 控制是否自动登录
    //  */
    // const [autoLogin, setAutoLogin] = useState(true)
    //
    // // 登录按钮的点击事件响应函数
    // const onSubmit = (err, values) => {
    //     console.log('login info ->', {
    //         ...values,
    //         autoLogin: autoLogin,
    //     });
    //
    //     // 清空登录失败的提示信息
    //     setNotice('')
    //
    //     // TODO（钟卓江）：等服务端登录 API 写好之后要修改，现在只是一个简单的测试
    //     // 和服务器通信，判断能否成功登录，并处理响应的事件（比如设置登录失败的提示信息）
    //     if (type === 'account') { // 账号密码登录
    //         // 如果登录失败，设置登录失败的提示信息（test）
    //         if (!err && (values.username !== 'admin' || values.password !== '888888')) {
    //             setTimeout(() => {
    //                 setNotice({
    //                     notice: '账号密码错误！',
    //                 });
    //             }, 500);
    //         }
    //     } else if (type === 'mobile') { // 手机登录
    //     }
    // }
    //
    // // 切换登录方式
    // const onTabChange = key => {
    //     setType(key)
    // };
    //
    // // 是否自动登录
    // const changeAutoLogin = e => {
    //     setAutoLogin(e.target.checked)
    // };

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
