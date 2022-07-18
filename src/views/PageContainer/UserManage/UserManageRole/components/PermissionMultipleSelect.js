import {message, Select} from "antd";
import React, {useEffect, useRef, useState} from "react";
import api from "../../../../../api/role";

/**
 * 权限多选器
 * @param props = {
 *     defaultValue=[], // 默认值
 *     placeholder:String, // 占位符
 *     onChange:function, // 改变选择内容之后会触发
 * }
 * @returns {JSX.Element}
 * @constructor
 */
export default function PermissionMultipleSelect(props) {
    const {Option} = Select
    const [options, setOptions] = useState([])
    let componentMounted = useRef(true)

    // 只在初次渲染的时候请求权限列表
    useEffect(() => {
        api.GetPermission().then(response => {
            // When component is still mounted
            if (componentMounted.current) {
                setOptions(
                    response.data.data.map((item) => {
                        return (
                            <Option key={item.permission_identifier}
                                    value={item.permission_identifier}>
                                {item.permission}
                            </Option>
                        );
                    })
                )
            }
        }).catch(() => {
            message.error('获取角色权限失败')
        })

        // This code runs when component is unmounted
        return () => {
            componentMounted.current = false
        }
    }, [])

    return (
        <Select
            mode="multiple"
            allowClear
            placeholder={props.placeholder}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
        >
            {options}
        </Select>
    )
}
