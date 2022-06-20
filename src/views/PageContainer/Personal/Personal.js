import React, {useEffect, useState} from 'react'
import style from './Personal.module.scss'
import {Avatar, Card, Image, message} from "antd";
import {EditOutlined,} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import PersonalDescription from "./components/PersonalDescription";
import UserModal from "../UserManage/UserManageAccount/components/UserModal";
import apiPersonal from "../../../api/personal";
import api from '../../../api/user'

function Personal() {
    // 用户信息
    const [userInfo, setUserInfo] = useState({});
    useEffect(() => {
        apiPersonal.getTopHeaderData()
            .then(value => {
                setUserInfo(value.data.data)
            })
    }, []);

    return (
        <div className={style.cardContainer}>
            <Card
                className={style.cardStyle}
                extra={(
                    <UserModal
                        buttonProps={{
                            type: 'text',
                            shape: "circle", // 按钮形状
                            icon: <EditOutlined/>, // 按钮图标
                            size: 'large',
                        }}
                        tooltipSuccessTitle={'编辑个人信息'}
                        title={'编辑个人信息'}
                        detailData={{
                            user_name: userInfo.user_name,
                            account: userInfo.account,
                            password: userInfo.password,
                            role_name: userInfo.role_name,
                            role_id: userInfo.role_id,
                            unit_id: userInfo.unit_id,
                            unit_name: userInfo.unit_name,
                        }}
                        saveInfoFunction={(data) => {
                            console.log('saveInfoFunction',data)
                            api.UpdateUser(data).then(() => {
                                message.success('修改个人信息成功')
                            }).catch(()=>{
                                message.error('修改个人信息失败')
                            }).finally(()=>{
                                // 刷新
                                location.reload()
                            })
                        }}
                        roleReadOnly={true}
                        unitReadOnly={true}
                    />
                )}
                title={(
                    <div>
                        <Avatar
                            alt={'用户头像'} // 图像无法显示时的替代文本

                            size={{
                                xs: 24,
                                sm: 32,
                                md: 40,
                                lg: 64,
                                xl: 80,
                                xxl: 100,
                            }}
                            src={<Image src="https://joeschmoe.io/api/v1/random"/>}
                        />
                        <div style={{
                            display: "inline",
                            fontSize: 20,
                            margin: '15px',
                        }}>
                            {userInfo.user_name}
                        </div>
                    </div>
                )}
            >
                <Meta
                    description={(
                        <PersonalDescription data={userInfo}/>
                    )}
                    className={style.cardMeta}
                />
            </Card>
        </div>
    )
}


export default Personal
