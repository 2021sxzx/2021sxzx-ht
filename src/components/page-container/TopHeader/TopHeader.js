import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import {Button, Image, Avatar} from 'antd'
import apiPersonal from '../../../api/personal';
import api from '../../../api/login';
import style from './TopHeader.module.scss';
import logo from './LOGO.jpg'

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
            <div className={style.logo}>
                <Image
                    height={'100%'}
                    src={logo}
                    preview={false}
                    onClick={jumpToHome}
                    className={style.getCursor}
                />
            </div>

            <div className={style.functionalZone}>
                <Button
                    // type={'link'}
                    onClick={api.logout}
                >
                    登出
                </Button>
                <Avatar
                    alt={'用户头像'}
                    src={
                        <Image
                            src={"https://joeschmoe.io/api/v1/random"}
                            preview={false}
                        />
                    }
                    className={style.getCursor}
                    onClick={jumpToPersonal}
                  />
                <div>
                    你好，<strong>{userInfo.user_name}</strong>。你是 <strong>{userInfo.unit_name}</strong> 的 <strong>{userInfo.role_name}</strong>
                </div>
            </div>
        </div>
    )
}