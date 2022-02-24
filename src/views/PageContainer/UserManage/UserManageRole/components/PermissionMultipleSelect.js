import {Select} from "antd";
import React from "react";

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

    // TODO 获取权限列表
    // 初始化可选权限
    // const children = props.children
    // 初始化可选权限
    /*
    key 为 id，option.children 为 权限名称，如：
    children.push(<Option key={detail.permission_identifier[i]}>{detail.permission[1]}</Option>);
    */
    // test 初始化可选权限
    const children = [];
    for (let i = 0; i < 11; i++) {
        children.push(
            <Option key={'permission_identifier' + i.toString()}
                    value={'permission_identifier' + i.toString()}>
                {'permission' + i.toString()}
            </Option>
        );
    }

    return (
        <Select
            mode="multiple"
            allowClear
            placeholder={props.placeholder}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
        >
            {children}
        </Select>
    )
}