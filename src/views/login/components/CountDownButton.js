import React, {useEffect, useState} from "react";
import {Button} from "antd";
import axios from "axios"
/**
 * 用于发送手机验证码的倒计时按钮
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function CountDownButton(props) {
    // 初始化倒计时的常数属性和设置倒计时状态
    const maxCount = 6
    const toSendText = '获取验证码'
    const [verifycode,setVerifyCode] = useState(props.verificationCode)
    useEffect(()=>{
        setVerifyCode(props.verificationCode)
    },[props.verificationCode])
    // console.log(props)
    const [countDownStatus, setCountDownStatus] = useState({
        count: maxCount,
        text: toSendText,
        isGetting: false,
    })

    // 重置倒计时状态
    const resetCountDownStatus = () => {
        setCountDownStatus({
            count: maxCount,
            text: toSendText,
            isGetting: false,
        })
    }

    // 倒计时中更新计时状态
    const countDowning = () => {
        setCountDownStatus({
            count: countDownStatus.count--,
            text: countDownStatus.count + 's 后重发',
            isGetting: true,
        })
    }

    // 设置倒计时
    const countDown = () => {
        countDowning()

        const intervalID = setInterval(() => {
            if (countDownStatus.count < 1) {
                resetCountDownStatus()
                // 清除定时器
                clearInterval(intervalID)
                console.log('countdown', countDownStatus.count)
            } else {
                countDowning()
            }
        }, 1000);
    }

    // 向服务器请求发送验证码
    const sendVerificationCode = () => {
        countDown()
        // axios.get("https://10.147.25.152:8082/sms/v2/std/send_single",
        // {
        //     userid:"JU5098",
        //     pwd:"918823",
        //     mobile:"18420058402",
        //     content:verifycode
        // }).then((res)=>{
        //     console.log("发送短信成功",res)
        // }).catch((err)=>{
        //     console.log("发送失败",err)
        // })
        props.getVC()
        //TODO 待 API 完善
        console.log("已发送验证码")
    }

    return (
        <Button
            block={true}
            onClick={sendVerificationCode}
            disabled={countDownStatus.isGetting}
            loading={countDownStatus.isGetting}
        >
            {countDownStatus.text}
        </Button>
    )
}
