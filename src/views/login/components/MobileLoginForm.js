import {Button, Col, Form, Input, message, Row} from "antd";
import {MobileOutlined, UserOutlined} from "@ant-design/icons";
import React, {useContext, useState} from "react";
import CountDownButton from "./CountDownButton";
import {loginStateContext} from "../../../router/IndexRouter";
import api from "../../../api/login";
import axios from "axios";
import v_account from '../../../account/verification_account.json'
import UrlJump from "../../../utils/UrlJump";
import DownloadUserManual from "./DownloadUserManual";

/**
 * 手机验证码登录
 * @returns {JSX.Element}
 * @constructor
 */
export default function MobileLoginForm() {
    const historyAccount = localStorage.getItem('account') ? localStorage.getItem('account') : '';
    const [account, setAccount] = useState(historyAccount)
    const {setLoginState} = useContext(loginStateContext)
    // const [phoneNumber,setPhoneNumber] = useState('')
    const [verificationCode, setVerificationCode] = useState("")
    const [failTime, setFailTime] = useState(0)
    // useEffect(()=>{
    //     getVC()
    // },[])
    const getVC = () => {
        let verificationCode = ""
        for (let i = 0; i < 8; i++)
            verificationCode += Math.floor(Math.random() * 10)
        localStorage.setItem("VerificationCode", verificationCode)
        // let now = new Date()
        // let month = now.getMonth()+1<10?"0"+(now.getMonth()+1).toString():(now.getMonth()+1).toString()
        // let day = now.getDate()<10?"0"+now.getDate().toString():now.getDate().toString()
        // let hour = now.getHours()<10?"0"+now.getHours().toString():now.getHours().toString()
        // let minute = now.getMinutes()<10?"0"+now.getMinutes().toString():now.getMinutes().toString()
        // let second = now.getSeconds()<10?"0"+now.getSeconds().toString():now.getSeconds().toString()
        // let TimeStamp = month+day+hour+minute+second
        // let pwd = v_account.userid+'00000000'+v_account.pwd+TimeStamp
        //明文模式
        axios.post("http://10.147.25.152:8082/sms/v2/std/send_single",
            {
                userid: v_account.userid,//字符串
                pwd: v_account.pwd,
                mobile: account,//字符串
                content: "验证码：" + verificationCode + ',请妥善保管。'
            }).then((res) => {
            console.log("发送短信成功", res)
        }).catch((err) => {
            console.log("发送失败", err)
        })
        setVerificationCode(verificationCode)
    }

    const onFinish = (value) => {
        if (localStorage.getItem("VerificationCode") === value.verificationCode) {
            api.Login({
                account: value.phoneNumber,
                //1 donate 验证码登录
                state: 1
            }).then(async response => {
                // 保存用户信息：账号密码用户id
                saveUserInfo(response, value)
                setLoginState('login')
                // 展现 0.1s 的登录成功操作提示并自动跳转到首页
                message.success('登录成功', 0.1, () => {
                    setFailTime(0);
                    UrlJump.goto('#/home')
                })
            }).catch((error) => {
                if (error.response.data !== undefined)
                    message.error(typeof error.response.data === 'string' ? error.response.data : '登录发生错误，请稍后重试')
                else
                    message.error("登录错误")
            })
        } else {
            setFailTime(failTime + 1)
            if(failTime >= 5)
                setFailTime(0)
                setVerificationCode("");
            message.error("验证码输入错误，错5次就需要重新发送验证码，请重新输入")
        }
    };
    const saveUserInfo = (response, values) => {
        // 保存账号
        localStorage.setItem('account', values.account);
        localStorage.setItem('_id', response.data.data._id);
        localStorage.setItem('roleID', response.data.data.role_id);
        setAccount(values.account);
    }

    const onFinishFailed = () => {
    }

    const handlePhoneNumber = (e) => {
        // console.log(e.target.value)
        setAccount(e.target.value)
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
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            {/*手机号码*/}
            <Form.Item
                // label="手机号码"
                name="phoneNumber"
                rules={[
                    {
                        required: true,
                        message: '请输入手机号码!',
                    },
                    {
                        // TODO：暂时保留了开发人员账号
                        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                        message: '请输入正确的手机号码'
                    },
                ]}
            >
                <Input placeholder={'手机号码'}
                       maxLength={32}
                       prefix={<UserOutlined className="site-form-item-icon"/>}
                       allowClear={true}
                       onChange={handlePhoneNumber}
                />
            </Form.Item>
            {/*验证码*/}
            <Form.Item
                // label="验证码"
                name="verificationCode"
                rules={[
                    {
                        required: true,
                        message: '请输入验证码!',
                    },
                    {
                        len: 8,
                        message: '请输入 8 位验证码'
                    }
                ]}
            >
                <Row>
                    <Col span={16}>
                        <Input placeholder={"验证码"}
                               maxLength={32}
                               prefix={<MobileOutlined/>}
                               allowClear={true}/>
                    </Col>
                    <Col span={7} offset={1}>
                        <CountDownButton verificationCode={verificationCode} getVC={getVC}/>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item>
                <DownloadUserManual/>
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
        </Form>
    )
}
