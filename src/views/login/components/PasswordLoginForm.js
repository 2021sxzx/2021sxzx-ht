import {Button,  Col, Form, Row, Input, message} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import QuickLogin from "./QuickLogin";
import api from "../../../api/login";
import UrlJump from "../../../utils/UrlJump";

/**
 * 账号密码登录
 * @returns {JSX.Element}
 * @constructor
 */
export default function PasswordLoginForm() {
    // const rememberPassword = !!localStorage.getItem('rememberPassword') // 是否选择记住密码（Boolean）
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
            // 保存用户信息：账号密码用户id
            await saveUserInfo(response)

            // 展现 0.1s 的登录成功操作提示并自动跳转到首页
            message.success('登录成功', 0.1, () => {
                UrlJump.goto('#/home')
            })
        }).catch(() => {
            // TODO（钟卓江）：细化报错信息
            message.error('请尝试重新登录，或者检查账号密码或者网络状态')
        })
    }

    /**
     * HACK：出于安全考虑，不再需要保存密码
     * 是否记住账号密码。
     * 信息保存到 localStorage：true 存非空字符串，false 存空字符串 ''
     * @param event
     */
    // const handleCheckboxChange = (event) => {
    //     // 将是否记住账号密码保存到 localStorage：true 存非空字符串，false 存空字符串 ''
    //     localStorage.setItem('rememberPassword',event.target.checked?'rememberPassword':'')
    // }

    /**
     * 在 localstorage
     * @param response 响应报文
     */
    const saveUserInfo = (response) => {
        // 保存账号
        localStorage.setItem('account', account)
        localStorage.setItem('_id', response.data.data._id);
        // localStorage.setItem('loginToken', response.data.data.jwt.token)
        // localStorage.setItem('role_name', response.data.data.role_name)
        // localStorage.setItem('roleName', response.data.data.role_name)
        localStorage.setItem('roleID', response.data.data.role_id)

        // HACK：出于安全考虑，不再需要保存密码
        // 从 localStorage 中获取是否记住密码（boolean）
        // let rememberPassword = !!localStorage.getItem('rememberPassword')
        // if(rememberPassword){
        //     localStorage.setItem('password',password)
        // }else{
        //     localStorage.removeItem('password')
        // }
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
                        message: '请输入手机号码!',
                    },
                ]}
            >
                <Input placeholder={'手机号码'}
                       defaultValue={historyAccount}
                       // type={"number"}
                       maxLength={15}
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
                <Input.Password placeholder={"密码"}
                                defaultValue={historyPassword}
                                type={"password"}
                                maxLength={32}
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
                {/*<Row>*/}
                {/*    <Col span={8}>*/}
                {/*        <Checkbox defaultChecked={rememberPassword} onChange={handleCheckboxChange}>记住密码</Checkbox>*/}
                {/*    </Col>*/}
                {/*    <Col span={3} offset={13}>*/}
                {/*        <a className="login-form-forgot" href="">*/}
                {/*            忘记密码*/}
                {/*        </a>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                <a className="login-form-forgot" href="">
                    忘记密码
                </a>
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
