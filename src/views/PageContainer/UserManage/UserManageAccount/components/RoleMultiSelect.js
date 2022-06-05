import {Select} from "antd";
import React, {useEffect, useState} from "react";
import api from "../../../../../api/role";

/**
 * 角色多选器
 * @param props = {
 *     defaultValue=[], // 默认值
 *     placeholder:String, // 占位符
 *     onChange:function, // 改变选择内容之后会触发
 * }
 * @returns {JSX.Element}
 * @constructor
 */
export default function RoleMultiSelect(props) {
    const {Option} = Select

    const [options,setOptions] = useState([])

    // 只在初次渲染的时候请求权限列表
    useEffect(()=>{
        api.GetRole().then(response => {
            console.log('RoleMultiSelect GetRole',response.data.data)
            setOptions(
                response.data.data.map((item)=>{
                    return (
                        <Option key={item.role_name}
                                value={item.role_name}>
                            {item.role_name}
                        </Option>
                    );
                })
            )
        }).catch(()=>{
            console.log('error:GetRoleList')
        })
    },[])

    return (
        <Select
            allowClear
            placeholder={props.placeholder}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
        >
            {options}
        </Select>
    )
}
