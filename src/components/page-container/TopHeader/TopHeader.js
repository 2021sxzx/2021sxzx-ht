import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {Button, Image, Avatar, Tooltip} from 'antd'
import apiPersonal from '../../../api/personal';
import api from '../../../api/login';
import style from './TopHeader.module.scss';
import {PoweroffOutlined} from "@ant-design/icons";

export default function TopHeader() {
    const history = useHistory();
    // 用户信息
    const [userInfo, setUserInfo] = useState({});
    useEffect(() => {
        apiPersonal.getTopHeaderData()
            .then(value => {
                setUserInfo(value.data.data)
            })
            .catch(() => {
            });
    }, []);

    const jumpToHome = () => {
        history.push('/home');
    }

    const jumpToPersonal = () => {
        history.push('/personal')
    }

    return (
        <div className={style.wrapBox}>
            <div className={style.logoContainer}>
                <Image
                    className={style.logo}
                    height={'100%'}
                    src={'public/imgs/ic_logo.png'}
                    preview={false}
                    onClick={jumpToHome}
                />
            </div>

            <div className={style.functionalZone}>
                <div className={style.userInfo}>
                    你好，<strong>{userInfo.user_name}</strong>。你是 <strong>{userInfo.unit_name}</strong> 的 <strong>{userInfo.role_name}</strong>
                </div>
                <Avatar
                    alt={'用户头像'}
                    src={
                        <Image
                            src={"https://joeschmoe.io/api/v1/random"}
                            preview={false}
                        />
                    }
                    className={style.avtar}
                    onClick={jumpToPersonal}
                />
                <div className={style.logoutContainer}>
                    <Tooltip title={'登出'}>
                        <Button
                            // type={'text'}
                            shape={'circle'}
                            icon={<PoweroffOutlined/>}
                            onClick={api.logout}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}
