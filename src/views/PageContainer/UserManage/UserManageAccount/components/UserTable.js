import ActivationStatusSwitch from "./ActivationStatusSwitch";
import UserModal from "./UserModal";
import api from "../../../../../api/user";
import React from "react";
import {Button, message, Space, Table, Tooltip} from "antd";

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
            // 刷新表格内容
            props.refreshTableData()
        }).catch(error => {
            console.log("error = ", error)
            message.error('修改用户信息发生错误');
            // 刷新表格内容
            props.refreshTableData()
        });
    }

    const deleteUser = (data) => {
        api.DeleteUser(data).then((() => {
            message.success('删除用户成功')
            // 刷新表格内容
            props.refreshTableData()
        }))
    }

    // 设置用户不能修改其他同名角色的非自己的账号信息
    const disableModal = (record) => {
        return record._id !== localStorage.getItem('_id') && record.role_name === localStorage.getItem('roleName')
    }

    // 设置删除按钮 disable 逻辑: 已激活的或者没有修改权限的不能删除
    const disableDeleteButton = (record) => {
        return record.activation_status !== 0 || disableModal(record)
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

        {
            title: '部门',
            dataIndex: 'department_name',
            key: 'department_name',
        },

        {
            title: '激活状态',
            dataIndex: 'activation_status',
            key: 'activation_status',
            render: (text, record) => (
                <ActivationStatusSwitch record={record} refreshTableData={props.refreshTableData}/>
            )
        },

        {
            title: '操作',
            key: 'detail',
            render: (text, record) => (//修改用户信息按钮
                <Space>

                    <UserModal buttonText={'修改用户信息'}
                               title={'修改用户信息'}
                               disable={disableModal(record)}
                               detailData={record}
                               saveInfoFunction={updateUserAndRefresh}
                               accountReadOnly={false}/>

                    {
                        disableDeleteButton(record) === false
                            ?
                            <Button disabled={disableDeleteButton(record)}
                                    onClick={() => {
                                        deleteUser({account: record.account})
                                    }}
                            >删除</Button>
                            :
                            <Tooltip title="如果要删除账号请先将账号设置为未激活" mouseEnterDelay={0.5}>
                                <Button disabled={disableDeleteButton(record)}
                                        onClick={() => {
                                            deleteUser({account: record.account})
                                        }}
                                >删除</Button>
                            </Tooltip>
                    }
                    {/*<Tooltip title="Tips: 1. 如果要删除账号请先将账号设置为未激活。2. 禁止修改相同角色的其他账号信息">*/}
                    {/*    <UserModal buttonText={'修改用户信息'}*/}
                    {/*               title={'修改用户信息'}*/}
                    {/*               disable={disableModal(record)}*/}
                    {/*               detailData={record}*/}
                    {/*               saveInfoFunction={updateUserAndRefresh}*/}
                    {/*               accountReadOnly={false}/>*/}
                    {/*    <Button disabled={disableDeleteButton(record)}*/}
                    {/*            onClick={() => {*/}
                    {/*                deleteUser({account: record.account})*/}
                    {/*            }}*/}
                    {/*    >删除</Button>*/}
                    {/*</Tooltip>*/}
                </Space>
            ),
        },
    ]

    return (
        <div>
            <Table columns={tableColumns} dataSource={props.tableData} rowKey={record => record._id}/>
        </div>
    )
}
