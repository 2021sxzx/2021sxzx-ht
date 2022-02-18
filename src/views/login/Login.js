import React, {useEffect, useState} from 'react'

import {Form, Input, Button, Alert, Checkbox, Row, Col, Layout} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';

const {Header, Footer, Sider, Content} = Layout;


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

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <Layout>
                <Header>广东省政务服务智能咨询平台</Header>
                <Content>
                    {/*登录表单*/}
                    <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            offset: 8,
                            span: 8,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        {/*头部图片和文字*/}
                        <Form.Item>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <img
                                        width={200}
                                        src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                                    />
                                </Col>
                            </Row>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <div>广东省政务服务智能咨询平台</div>
                                </Col>
                            </Row>
                        </Form.Item>
                        {/*用户名*/}
                        <Form.Item
                            // label="用户名"
                            name="userAccount"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入账号!',
                                },
                            ]}
                        >
                            <Input placeholder={'账号'} prefix={<UserOutlined className="site-form-item-icon"/>}/>
                        </Form.Item>
                        {/*密码*/}
                        <Form.Item
                            // label="密码"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码!',
                                },
                            ]}
                        >
                            <Input.Password type={"password"} placeholder={"密码"}
                                            prefix={<LockOutlined className="site-form-item-icon"/>}/>
                        </Form.Item>
                        {/*是否记住登录状态 & 忘记密码 */}
                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                            wrapperCol={{
                                offset: 8,
                                span: 8,
                            }}
                        >
                            <Row>
                                <Col span={8}>
                                    <Checkbox>自动登录</Checkbox>
                                </Col>
                                <Col span={3} offset={13}>
                                    <a className="login-form-forgot" href="">
                                        忘记密码
                                    </a>
                                </Col>
                            </Row>
                        </Form.Item>
                        {/*登录按钮*/}
                        <Form.Item>
                            <Row type="flex" justify="center" align="middle">
                                <Col span={24}>
                                    <Button type="primary" htmlType="submit" block={true}>
                                        登录
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>
                        {/*底部,可以塞一些第三方登录方式等等*/}
                        </Form.Item>
                    </Form>
                </Content>
                {/*TODO(钟卓江):将样式移到scss文件中*/}
                <Footer style={{background: '#FFFF'}}>
                    <Row>
                        <Col span={9}>
                            增值电信业务经营许可证：合字B2-20090007
                        </Col>
                        <Col span={6}>
                            京ICP备10036305号-7
                        </Col>
                        <Col span={6}>
                            京公网安备11010802022657号
                        </Col>
                        <Col span={3}>
                            © 2022 Microsoft
                        </Col>
                    </Row>
                </Footer>
            </Layout>
        </div>

        // <div className="login-warp">
        //     <Login
        //         defaultActiveKey={type}
        //         onTabChange={onTabChange}
        //         onSubmit={onSubmit}
        //     >
        //         <Tab key="tab1" tab="Account">
        //             {notice && (
        //                 <Alert
        //                     style={{ marginBottom: 24 }}
        //                     message={notice}
        //                     type="error"
        //                     showIcon
        //                     closable
        //                 />
        //             )}
        //             <UserName name="username" />
        //             <Password name="password" />
        //         </Tab>
        //         <Tab key="tab2" tab="Mobile">
        //             <Mobile name="mobile" />
        //             <Captcha onGetCaptcha={() => console.log('Get captcha!')} name="captcha" />
        //         </Tab>
        //         <div>
        //             <Checkbox checked={autoLogin} onChange={changeAutoLogin}>
        //                 Keep me logged in
        //             </Checkbox>
        //             <a style={{ float: 'right' }} href="">
        //                 Forgot password
        //             </a>
        //         </div>
        //         <Submit>Login</Submit>
        //         <div>
        //             Other login methods
        //             <span className="icon icon-alipay" />
        //             <span className="icon icon-taobao" />
        //             <span className="icon icon-weibo" />
        //             <a style={{ float: 'right' }} href="">
        //                 Register
        //             </a>
        //         </div>
        //     </Login>
        // </div>
    )
}
