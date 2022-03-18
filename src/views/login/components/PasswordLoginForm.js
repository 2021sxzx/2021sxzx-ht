import {Button, Checkbox, Col, Form, Row, Input} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import QuickLogin from "./QuickLogin";
import api from "../../../api/login";
import Cookie from "../../../utils/Cookie";
import UrlJump from "../../../utils/UrlJump";

/**
 * 账号密码登录
 * @returns {JSX.Element}
 * @constructor
 */
export default function PasswordLoginForm() {
    const [account, setAccount] = useState('')
    const [password, setPassword] = useState('')
    const [sideBar,setSideBar] = useState({})

    const handleInputChangeAccount = (e) => {
        setAccount(e.target.value)
    }

    const handleInputChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const login = () => {
        api.Login({
            account: account,
            password: password
        }).then(response => {
            console.log('login response', response.data)
            // 存 token
            Cookie.setCookie('loginToken',response.data.data.jwt.token,1,'days')
            // 存角色
            Cookie.setCookie('roleName',response.data.data.role_name,1,'days')
            // 获取侧边栏
            getSideBar(response.data.data.role_name)
            const sideBarJson = JSON.stringify(sideBar);
            sessionStorage.setItem('sideBar',sideBarJson)
            console.log('sideBar',Cookie.getCookie('sideBar'))

            // 跳转到首页
            // UrlJump.goto('#/home')
        }).catch(error => {
            console.log('error:login', error)
        })
    }

    const getSideBar = (roleName) => {
        api.GetSideBar({roleName}).then((response => {
            console.log('getSideBar',response.data.data)
            setSideBar(response.data.data)

        })).catch(error => {
            console.log("error getSideBar",error)
        })
    }




    return (
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
            autoComplete="off"
        >
            {/*账号/手机号码*/}
            <Form.Item
                // label="账号"
                name="account"
                rules={[
                    {
                        required: true,
                        message: '请输入账号/手机号码!',
                    },
                ]}
            >
                <Input placeholder={'账号/手机号码'} prefix={<UserOutlined className="site-form-item-icon"/>}
                       allowClear={true} onChange={handleInputChangeAccount}/>
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
                <Input.Password type={"password"}
                                placeholder={"密码"}
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                allowClear={true}
                                onChange={handleInputChangePassword}/>
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
                        <Button type="primary" htmlType="submit" block={true} onClick={login}>
                            登录
                        </Button>
                    </Col>
                </Row>
            </Form.Item>
            <Form.Item>
                {/*第三方快捷登录*/}
                <QuickLogin/>
            </Form.Item>
        </Form>
    )
}