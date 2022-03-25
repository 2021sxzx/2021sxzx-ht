import {Button, Checkbox, Col, Form, Row, Input, message} from "antd";
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
    const rememberPassword = !!localStorage.getItem('rememberPassword') // 是否选择记住密码（Boolean）
    const historyAccount = localStorage.getItem('account')
    const historyPassword = localStorage.getItem('password')

    const [account, setAccount] = useState(historyAccount)
    const [password, setPassword] = useState(historyPassword)

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
        }).then(async response => {
            console.log('login response', response.data)
            // 存 token
            Cookie.setCookie('loginToken', response.data.data.jwt.token)
            // 存角色
            Cookie.setCookie('roleName', response.data.data.role_name)
            // // 根据登录角色获取侧边栏并保存到 sessionStorage 中
            // MenuList.getAndStorageMenuList(()=>{},response.data.data.role_name)

            // 保存账号密码
            saveAccountPassword()

            // 展现 0.1s 的登录成功操作提示并自动跳转到首页
            message.success('登录成功', 0.1, () => {
                UrlJump.goto('#/home')
            })
        }).catch(() => {
            message.error('账号或密码错误，请尝试重新登录')
        })
    }

    const handleCheckboxChange = (e) => {
        // 将是否记住账号密码保存到 localStorage：true 存非空字符串，false 存空字符串 ''
        localStorage.setItem('rememberPassword',e.target.checked?'rememberPassword':'')
    }

    const saveAccountPassword = ()=>{
        // 从 localStorage 中获取是否记住密码（boolean）
        let rememberPassword = !!localStorage.getItem('rememberPassword')
        localStorage.setItem('account',account)
        if(rememberPassword){
            localStorage.setItem('password',password)
        }else{
            localStorage.setItem('password','')
        }
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
                <Input placeholder={'账号/手机号码'}
                       defaultValue={historyAccount}
                       prefix={<UserOutlined className="site-form-item-icon"/>}
                       allowClear={true}
                       onChange={handleInputChangeAccount}/>
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
                                defaultValue={historyPassword}
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
                        <Checkbox defaultChecked={rememberPassword} onChange={handleCheckboxChange}>记住密码</Checkbox>
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
