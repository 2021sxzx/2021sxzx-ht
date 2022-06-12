import {Select} from "antd";
import React, {useEffect, useRef, useState} from "react";
import api from "../../../../../api/role";
const {Option} = Select
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
    const [options,setOptions] = useState([])
    const componentMounted = useRef(true) // 组件是否加载成功

    // 只在初次渲染的时候请求权限列表
    useEffect(()=>{
        api.GetRole().then(response => {
            // When component is still mounted
            if (componentMounted.current === true) {
                setOptions(
                    response.data.data.map((item)=>{
                        return (
                            <Option key={item.role_id}
                                    value={item.role_id}>
                                {item.role_name}
                            </Option>
                        );
                    })
                )
            }
        }).catch(()=>{
            console.log('error:GetRoleList')
        })

        // This code runs when component is unmounted
        return ()=>{
            // set it false
            componentMounted.current = false
        }
    },[])

    return (
        <Select
            allowClear
            showSearch
            placeholder={props.placeholder}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            filterOption={(input, option) => {
                option.children.toLowerCase().includes(input.toLowerCase())
            }}
        >
            {options}
        </Select>
    )
}
