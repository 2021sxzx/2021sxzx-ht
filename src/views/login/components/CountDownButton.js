import React, {useEffect, useState, useMemo} from "react";
import {Button, message} from "antd";
import api from "../../../api/login";
/**
 * 用于发送手机验证码的倒计时按钮
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function CountDownButton(props) {
    const maxLockSecond = 60
    const [lockSecond,setLockSecond] = useState(0)

    // 按钮文本
    const buttonText = useMemo(
        () => (lockSecond === 0 ? `获取验证码` : `${lockSecond}s后重发`),
        [lockSecond]
    )
    // 是否锁定按钮
    // TODO: 需要父组件提供一个布尔值用于判断手机号码是否正确，手机号码错误时也需要锁定
    const buttonLock = useMemo(() => lockSecond > 0, [lockSecond]);

    // 初次启动时查询localStorage判断是否继续计时
    useEffect(()=>{
        let lockEnd = localStorage.getItem('sxzx-ht-sendVC-lockEnd')
        if(lockEnd === null || lockEnd === undefined){
            // do nothing
        }else{
            let LeftoverLockSecond = parseInt((lockEnd - new Date().getTime())/1000)
            if(LeftoverLockSecond > 0){
                // 还未到解锁时间，开始倒计时
                setLockTimer(LeftoverLockSecond)
            }else{
                // 已到达解锁时间可将localStorage中的字段删除
                localStorage.removeItem('sxzx-ht-sendVC-lockEnd')
            }
        }
    },[])

    // 设置计时器
    const setLockTimer = (second) => {
        setLockSecond(second)
        const timer = setInterval(() => {
            second--
            setLockSecond(second)
            if (second < 1) {
                // 已到达解锁时间可将localStorage中的字段删除
                localStorage.removeItem('sxzx-ht-sendVC-lockEnd')
                // 清除定时器
                clearInterval(timer)
            }
        }, 1000);
    }

    // 向服务器请求发送验证码
    const sendVerificationCode = () => {
        // 在localStorage中储存下一次可发验证码时间
        localStorage.setItem('sxzx-ht-sendVC-lockEnd', new Date().getTime() + maxLockSecond * 1000)
        // 开始倒计时
        setLockTimer(maxLockSecond)
        api.RequestVC({
            account: props.account
        }).then((response)=>{
            message.success(response.data.msg)
        }
        ).catch(() => {
            message.error("获取验证码错误")
        })
    }

    return (
        <Button
            block={true}
            onClick={sendVerificationCode}
            disabled={buttonLock}
            loading={buttonLock}
        >
            {buttonText}
        </Button>
    )
}
