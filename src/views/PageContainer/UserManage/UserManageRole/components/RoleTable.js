import {message, Table, Tag} from "antd";
import React, {useCallback} from "react";
import api from "../../../../../api/role";
import RoleModal from "./RoleModal";

/**
 * 角色管理的表格
 * @param props = {
 *     tableData:[],// 表格内的数据
 *     refreshTableData:function,// 用于刷新表格数据
 *     loading:boolean,// 是否处于加载状态
 * }
 * @returns {JSX.Element}
 * @constructor
 */
export default function RoleTable(props) {
    console.log('RoleTable')

    const UpdateRoleInfoAndRefresh = useCallback((data) => {
        Promise.all([api.UpdateRole(data), api.UpdateRolePermission(data)])
            .then(() => {
                message.success('修改角色信息成功')
            })
            .catch(() => {
                message.error('修改角色信息发生错误')
            })
            .finally(() => {
                // 刷新表格
                props.refreshTableData()
            })
    }, [])

    // 表格的属性/列名
    const tableColumns = [
        {
            title: '角色名称',
            dataIndex: 'role_name',
            key: 'role_name',
            fixed: 'left',
            width: 100,
        },
        {
            title: '角色描述',
            dataIndex: 'role_describe',
            key: 'role_describe',
            width: 150,
        },
        {
            title: '角色权限',
            dataIndex: 'permission',
            key: 'permission',
            width: 250,
            render: (permission, record) => (
                <>
                    {permission.map(permission => {
                        return (
                            <Tag key={record.role_name + permission}>
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
            fixed: 'right',
            width: 100,
            render: (text, record) => (//查看详情按钮和详情弹窗
                <RoleModal
                    buttonText={'修改角色信息'}
                    buttonType={''}
                    title={'修改角色信息'}
                    detailData={record}
                    callback={UpdateRoleInfoAndRefresh}
                />
            ),
        },
    ]

    return (
        <Table
            columns={tableColumns}
            dataSource={props.tableData !== {} ? props.tableData : {}}
            rowKey={record => record.role_id + record.role_name}
            sticky={true} //设置粘性头部和滚动条
            scroll={{ //表格是否可滚动，也可以指定滚动区域的宽、高
                scrollToFirstRowOnChange: true, // 当分页、排序、筛选变化后是否滚动到表格顶部
                x: 'max-content',//'100%', // 设置横向滚动，也可用于指定滚动区域的宽
                y: 400, //设置纵向滚动，也可用于指定滚动区域的高
            }}
            pagination={{//分页器
                // defaultPageSize: 5,// 默认每页的数量
                pageSizeOptions: ['5', '10', '15', '20', '25'], // 允许的每页数量
                showSizeChanger: true, // 是否展示 pageSize 切换器
                responsive: true, // 当 size 未指定时，根据屏幕宽度自动调整尺寸
                showQuickJumper: true, // 是否可以快速跳转至某页
            }}
            loading={props.loading}
        />
    )
}
