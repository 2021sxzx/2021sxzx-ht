// 页面上方使用条件搜索和角色创建导入的表单
import {Button, Space} from "antd";
import UserModal from "./UserModal";
import api from "../../../../../api/user";
import SearchForm from "./SearchForm";
import React from "react";

/**
 * 功能区，包括搜索筛选和增加用户等功能性按钮
 * @returns props = {
 *     getSearch:function, // 点击搜索按钮会触发的回调函数
 *     refreshTableData:function, // 用于重新获取表格数据，刷新表格内容
 * }
 * @constructor
 */
export default function FunctionalZone (props){
    // TODO（钟卓江）：等待批量导入用户的 API 完成后完善
    const multiCreate = () => {
        console.log('批量导入并刷新表格')

        // 刷新表格内容
        props.refreshTableData()
    }

    const addUserAndRefresh = function (data){
        // 向服务器通信
        api.AddUser(data).then(response => {
            // log 服务端返回的搜索结果
            console.log('addUserAndRefresh =', response.data)
        }).catch(error => {
            console.log('error = ',error)
        });

        // 刷新表格内容
        props.refreshTableData()
    }

    return (
        <>
            <Space direction="vertical">
                {/*账号按创建钮*/}
                <UserModal buttonText={"账号创建"} buttonType={"primary"} title={"账号创建"} detailData={{
                    user_name: '',
                    password: '',
                    role_name: '',
                    account: '',
                    department: '',
                }} callback={addUserAndRefresh} />

                {/*批量导入按钮*/}
                <Button type="primary" onClick={multiCreate}>批量导入用户</Button>

                {/*搜索表单*/}
                <SearchForm getSearch={props.getSearch}/>
            </Space>
        </>
    )
}
