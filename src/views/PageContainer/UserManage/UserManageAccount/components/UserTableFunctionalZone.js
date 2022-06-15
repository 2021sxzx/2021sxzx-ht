// 页面上方使用条件搜索和角色创建导入的表单
// import {Button, Space, message} from "antd";
// import UserModal from "./UserModal";
// import BatchImportUserButton from "../components/BatchImportUserButton/BatchImportUserButton";
// import api from "../../../../../api/user";
import SearchForm from "./SearchForm";
import React from "react";
import UserModal from "./UserModal";
import api from "../../../../../api/user";
import {message, Space} from "antd";
// import BatchImportUserButton from "./BatchImportUserButton/BatchImportUserButton";

/**
 * 功能区，包括搜索筛选和增加用户等功能性按钮
 * @returns props = {
 *     getSearch:function, // 点击搜索按钮会触发的回调函数
 *     unitName:string, // 正在选择展示的用户所属部门
 *     refreshTableData:function, // 用于重新获取表格数据，刷新表格内容
 * }
 * @constructor
 */
const UserTableFunctionalZone = (props) => {

    const addUserAndRefresh = function (data) {
        api.AddUser(data).then(response => {
            if (response.data.code === 404) {
                message.warn(response.data.msg);
            } else {
                message.success('用户创建成功');
            }
        }).catch(() => {
            message.error('用户创建发生错误');
        }).finally(() => {
            // 刷新表格数据
            props.refreshTableData()
        })
    }

    return (
        <div style={{
            display: "inline",
            width: '100%',
            position: "relative",
        }}>
            <div style={{
                float: "right",
            }}>
                <Space direction="horizontal">
                    {
                        props.unitID
                            ?
                            // 部门用户创建按钮
                            <UserModal
                                buttonText={"部门用户创建"}
                                buttonProps={{
                                    // type: "primary",
                                    disabled: false,
                                }}
                                title={"部门用户创建"}
                                detailData={{
                                    user_name: '',
                                    password: '',
                                    role_name: '',
                                    account: '',
                                    role_id: 15815115118,// 默认机构管理员
                                    unit_id: props.unitID,
                                    unit_name: props.unitName,
                                }}
                                saveInfoFunction={addUserAndRefresh}
                                unitReadOnly={true}
                            />
                            :
                            <div/>
                    }

                    {/*搜索表单*/}
                    <SearchForm getSearch={props.getSearch}/>
                </Space>
            </div>

            <div style={{
                display: "inline-block",
                fontSize: 20,
                color: '#333333',
            }}>
                {props.unitName ? `${props.unitName}` : '全部用户'}
            </div>
        </div>
    )
}

export default React.memo(UserTableFunctionalZone)
