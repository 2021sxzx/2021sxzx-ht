import ActivationStatusSwitch from "./ActivationStatusSwitch";
import UserModal from "./UserModal";
import api from "../../../../../api/user";
import React from "react";
import {message, Table} from "antd";

/**
 * 后台账号管理的表格
 * @param props = {
 *     tableData:[],// 表格内的数据
 *     refreshTableData:function,// 用于刷新表格数据
 * }
 * @returns {JSX.Element}
 * @constructor
 */
export default function UserTable(props) {
    // 修改用户信息
    const updateUserAndRefresh = (data) => {
        api.UpdateUser(data).then(response => {
            // log 服务端返回的搜索结果
            console.log('updateUserAndRefresh =', response.data)
            message.success('修改用户信息成功');
        }).catch(error => {
            console.log("error = ",error)
            message.error('修改用户信息发生错误');
        });

        // 刷新表格内容
        props.refreshTableData()
    }

    // 表格的属性/列名
    const tableColumns = [//  修改dataIndex和key，以便和服务器进行数据对接
        {
            title: '用户姓名',
            dataIndex: ['user_name'],
            key: 'user_name',
        },
        {
            title: '用户账号',
            dataIndex: ['account'],
            key: 'account',
        },
        {
            title: '角色',
            dataIndex: 'role_name',
            key: 'role_name',
        },
        // TODO（钟卓江）：部门表的信息还没完善，API也欠缺
        {
            title: '部门',
            // dataIndex: 'department',
            key: 'department',
            render: () => (
                <>缺</>
            )
        },

        {
            title: '激活状态',
            dataIndex: 'activation_status',
            key: 'activation_status',
            render: (text, record) => (
                <ActivationStatusSwitch record={record}/>
            )
        },

        {
            title: '操作',
            key: 'detail',
            render: (text, record) => (//修改用户信息按钮
                <UserModal buttonText={'修改用户信息'} title={'修改用户信息'}
                           detailData={record} saveInfoFunction={updateUserAndRefresh} accountReadOnly={false}/>
            ),
        },
    ]

    return (
        <Table columns={tableColumns} dataSource={props.tableData}/>
    )
}