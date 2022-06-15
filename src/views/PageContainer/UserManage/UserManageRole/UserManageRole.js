/**
 * 用户管理/角色管理页面
 */
import React, {useCallback, useEffect, useState} from 'react'

import {message} from 'antd';

import api from "../../../../api/role";
import SelectForm from "./components/SelectForm";
import RoleTable from "./components/RoleTable";

export default function UserManageList() {
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(true)

    // 第一次渲染组件的的时候加载表格数据
    useEffect(() => {
        getRole()
    }, [])

    // 从服务器获取角色表格的数据，保存到 tableData 中
    const getRole = useCallback(() => {
        setLoading(true)
        api.GetRole().then(response => {
            setTableData(response.data.data)
        }).catch(() => {
            message.error('获取角色失败，请稍后重试')
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    // 从服务器中获取搜索结果，保存到 tableData 中
    const getSearchRole = useCallback((data) => {
        setLoading(true)
        api.SearchRole(data).then(response => {
            setTableData(response.data.data)
            message.success("搜索角色成功")
        }).catch(() => {
            message.error("搜索角色出现错误")
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    return (
        <div>
            <div style={{
                display: "inline-block",
                width: '100%',
                position: 'relative',
            }}>
                <div style={{
                    display: "inline-flex",
                    alignItems: 'center',
                    fontSize: 20,
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    padding: '0 10px'
                }}>
                    角色列表
                </div>
                <div style={{
                    float: "right",
                }}>
                    <SelectForm getSearch={getSearchRole} refreshTableData={getRole}/>
                </div>
            </div>
            {/*间隔*/}
            <div style={{margin: '12px'}}/>
            {/* 用户评价的表格 */}
            <RoleTable tableData={tableData} refreshTableData={getRole} loading={loading}/>
        </div>
    )
}
