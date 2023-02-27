import {Form} from "antd";
import React from "react";
import style from "./PersonalDescription.module.scss"
import ChangePassword from './ChangePassword'
import {EditOutlined,} from "@ant-design/icons";

/**
 * 个人中心中展示的数据表单
 * @param props = {
 *     data:{ // 要展示的数据
 *         account: string,
 *         user_name: string,
 *         password: string,
 *         role: string,
 *         unit: string,
 *     }
 * }
 * @return {JSX.Element}
 * @constructor
 */
function PersonalDescription(props) {
    const [form] = Form.useForm()

    // 表单初始化数据
    const initialValues = {
        account: props.data.account,
        user_name: props.data.user_name,
        password: props.data.password,
        role: props.data.role_id,
        unit: props.data.unit_id,
    }

    return (
        <div className={style.BOX}>
            <Form
                form={form}
                initialValues={initialValues}
            >
                <Form.Item
                    label="账号/手机号码"
                    name="account"
                >
                    <div>
                        <div id="left" className={style.show_l} suppressContentEditableWarning
                             contentEditable="false">{props.data.account} </div>
                        {/* <Button className={style.show_r} onClick={changeDiv("left")}>编辑</Button>
                <Button className={style.show_r} onClick={changeDiv("left")}>取消</Button>  */}
                    </div>

                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                >
                    <div>
                        **********

                        <ChangePassword
                            buttonProps={{
                                type: 'text',
                                shape: "circle", // 按钮形状
                                icon: <EditOutlined/>, // 按钮图标
                                size: 'large',
                            }}
                            tooltipSuccessTitle={'修改密码'}
                            title={'修改密码'}
                            detailData={{
                                user_name: props.data.user_name,
                                account: props.data.account,
                                password: props.data.password,
                                role_id: props.data.role_id,

                            }}
                            saveInfoFunction={(data) => {
                                api.UpdateUser(data).then(() => {
                                    message.success('修改个人信息成功')
                                }).catch(() => {
                                    message.error('修改个人信息失败')
                                }).finally(() => {
                                    // 刷新
                                    location.reload()
                                })
                            }}
                            roleReadOnly={true}
                            unitReadOnly={true}
                        />

                    </div>
                </Form.Item>


                <Form.Item
                    label="角色"
                    name="roleName"
                >
                    {props.data.role_name}
                </Form.Item>

                <Form.Item
                    label="机构"
                    name="unitName"
                >
                    {props.data.unit_name}
                </Form.Item>
            </Form>
        </div>
        // <div className={style.BOX}>
        //     <ul>
        //         <li>
        //             <div className={style.show_l}> OK好</div>
        //             <div className={style.show_r}> nook</div>
        //         </li>
        //     </ul>
        // </div>
    )
}

export default PersonalDescription
