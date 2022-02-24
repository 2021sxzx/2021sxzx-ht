import {message, Table, Tag} from "antd";
import React from "react";
import api from "../../../../../api/role";
import RoleModal from "./RoleModal";

/**
 * 角色管理的表格
 * @param props = {
 *     tableData:[],// 表格内的数据
 *     refreshTableData:function,// 用于刷新表格数据
 * }
 * @returns {JSX.Element}
 * @constructor
 */
export default function RoleTable(props) {
    const UpdateRoleInfoAndRefresh = (data) => {
        // 更新非权限相关的信息
        api.UpdateRole(data).then(response => {
            console.log('UpdateRole = ', response.data)
        }).catch(error => {
            message.error('修改角色信息发生错误')
            console.log("UpdateRole error",error)
        })

        // 更新权限相关的信息
        api.UpdateRolePermission(data).then(response => {
            console.log('UpdatePermission = ', response.data)
        }).catch(error => {
            message.error('修改角色信息发生错误')
            console.log("UpdateRolePermission error",error)
        })

        message.success('修改角色信息成功')

        // 刷新表格内容
        props.refreshTableData()
    }

    // 表格的属性/列名
    const tableColumns = [
        {
            title: '角色名称',
            dataIndex: 'role_name',
            key: 'role_name',
        },
        {
            title: '角色描述',
            dataIndex: 'role_describe',
            key: 'role_describe',
        },
        {
            title: '角色权限',
            dataIndex: 'permission',
            key: 'permission',
            render: permission => (
                <>
                    {permission.map(permission => {
                        return (
                            <Tag key={permission}>
                                {permission}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: '修改角色信息',
            key: 'detail',
            render: (text, record) => (//查看详情按钮和详情弹窗
                <RoleModal buttonText={'修改角色信息'}
                           buttonType={''}
                           title={'修改角色信息'}
                           detailData={record}
                           callback={UpdateRoleInfoAndRefresh}/>
            ),
        },
    ]

    return (
        <Table columns={tableColumns} dataSource={props.tableData}/>
    )
}