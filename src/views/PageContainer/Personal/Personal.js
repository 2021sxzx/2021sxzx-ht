import React from 'react'
import style from './Personal.module.scss'
import {Avatar, Card, Image, message} from "antd";
import {EditOutlined,} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import PersonalDescription from "./components/PersonalDescription";
import UserModal from "../UserManage/UserManageAccount/components/UserModal";


function Personal() {

    return (
        <div className={style.cardContainer}>
            <Card
                className={style.cardStyle}
                // cover={
                //     <div>
                //         {/*<img*/}
                //         {/*    alt="example"*/}
                //         {/*    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"*/}
                //         {/*/>*/}
                //         <Avatar
                //             size={{
                //                 xs: 48,
                //                 sm: 64,
                //                 md: 80,
                //                 lg: 128,
                //                 xl: 160,
                //                 xxl: 200,
                //             }}
                //             src="https://joeschmoe.io/api/v1/random"
                //
                //         />
                //     </div>
                // }
                extra={(
                    // <Button icon={<EditOutlined key="edit"/>} type={'text'} size={'large'}/>
                    <UserModal
                        // buttonText={'修改用户信息'}
                        buttonProps={{
                            // disabled: false,
                            type: 'text',
                            shape: "circle", // 按钮形状
                            icon: <EditOutlined/>, // 按钮图标
                            size: 'large',
                        }}
                        tooltipSuccessTitle={'编辑个人信息'}
                        // tooltipErrorTitle={'不能修改同级别角色的用户信息'}
                        title={'编辑个人信息'}
                        detailData={{
                            user_name: '小王',
                            account: '18128706873',
                            password: '11aaAA@@',
                            role_name: 'role_name',
                            role_id: 123,
                            unit_id: 123,
                            unit_name: 'unit_name',
                        }}
                        saveInfoFunction={() => {
                            message.success('修改个人信息成功（test）')
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
                            src={<Image src="https://joeschmoe.io/api/v1/random" />}
                        />
                        <div style={{
                            display: "inline",
                            fontSize: 20,
                            margin: '15px',
                        }}>小王
                        </div>
                    </div>
                )}

                // actions={[
                //     // <SettingOutlined key="setting" />,
                //     <EditOutlined key="edit" />,
                //     // <EllipsisOutlined key="ellipsis" />,
                // ]}
            >
                <Meta
                    // avatar={<Avatar src="https://joeschmoe.io/api/v1/random"/>} // 头像
                    // title={ (
                    //         <div>
                    //             个人资料
                    //             <EditOutlined key="edit"/>
                    //         </div>
                    //     )
                    // } // 标题
                    description={(
                        <PersonalDescription/>
                    )}
                    className={style.cardMeta}
                />
            </Card>
            {/*<div style={{*/}
            {/*    float:"right",*/}
            {/*    display:"flex",*/}
            {/*    alignItems:"center",*/}
            {/*}}>*/}
            {/*    <div style={{*/}
            {/*        display: 'inline-block',*/}
            {/*        margin:'25px',*/}
            {/*    }}>*/}
            {/*        <Avatar*/}
            {/*            size={{*/}
            {/*                xs: 48,*/}
            {/*                sm: 64,*/}
            {/*                md: 80,*/}
            {/*                lg: 128,*/}
            {/*                xl: 160,*/}
            {/*                xxl: 200,*/}
            {/*            }}*/}
            {/*            src="https://joeschmoe.io/api/v1/random"*/}

            {/*        />*/}
            {/*    </div>*/}
            {/*    <div style={{*/}
            {/*        display: 'inline-block'*/}
            {/*    }}>*/}
            {/*        <PersonalDescription/>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
}


export default Personal
