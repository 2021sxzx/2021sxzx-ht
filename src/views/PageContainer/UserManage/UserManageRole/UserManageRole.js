/**
 * 用户管理/角色管理页面
 */

import React, { useEffect, useState } from 'react'

import { Space, message } from 'antd';

import api from "../../../../api/role";
import SelectForm from "./components/SelectForm";
import RoleTable from "./components/RoleTable";


// TODO(zzj): 修改和服务器的数据接口
export default function CommentManageList() {
    // 用 [] 初始化 useState，第一项（tableData）用于保存状态值（表格数据），第二项（setTableData）用于保存更新状态的函数，
    const [tableData, setTableData] = useState([])
    // 从服务器获取评论表格的数据，保存到 tableData 中
    const getRole = (data) => {
        api.GetRole(data).then(response => {
            setTableData(response.data.data)
            console.log('response.data.data=', response.data.data)
        }).catch(error => {
            console.log('GetRole error:', error)
        })
    }
    // 从服务器中获取搜索结果，保存到 tableData 中
    const getSearchRole = (data) => {
        // log 搜索值
        console.log('roleSearchValue=', data)
        api.SearchRole(data).then(response => {
            // log 服务端返回的搜索结果
            console.log('searchResult=', response.data)
            setTableData(response.data.data)
            message.success("搜索角色成功")
        }).catch(error => {
            message.error("搜索角色出现错误")
            console.log("SearchRole error:", error)
        })
    }
    // 第一次渲染组件的的时候加载表格数据
    useEffect(() => {
        getRole({})
    }, [])

    return (
        <div>
            <Space direction="vertical" size={12} style={{width:100+'%'}}>
                {/* 搜索 */}
                <SelectForm getSearch={getSearchRole} refreshTableData={getRole} />
                {/* 用户评价的表格 */}
                <RoleTable tableData={tableData} refreshTableData={getRole} />
            </Space>
        </div>
    )
}
