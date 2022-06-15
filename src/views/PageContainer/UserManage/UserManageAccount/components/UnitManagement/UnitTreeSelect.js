import {TreeSelect} from "antd";
import React, {useEffect, useRef, useState} from "react";
import api from "../../../../../../api/unit";
import {DownOutlined} from "@ant-design/icons";

/**
 * 机构多选器
 * @param props = {
 *     defaultValue=[], // 默认值
 *     placeholder:String, // 占位符
 *     onChange:function, // 改变选择内容之后会触发
 * }
 * @returns {JSX.Element}
 * @constructor
 */
export default function UnitTreeSelect(props) {
    const [treeData, setTreeData] = useState([])
    const componentMounted = useRef(true) // 组件是否加载成功

    // 只在初次渲染的时候请求权限列表
    useEffect(() => {
        api.GetUnit().then(response => {
            // When component is still mounted
            if (componentMounted.current === true) {
                setTreeData([response.data.data])
            }
        }).catch(() => {
        })

        // This code runs when component is unmounted
        return () => {
            // set it false
            componentMounted.current = false
        }
    }, [])

    return (
        <div>
            <TreeSelect
                key={props.defaultValue} // 用于当 defaultValue 发生变化时重新渲染组件从而实现 defaultValue 的更新
                showSearch// 搜索
                switcherIcon={<DownOutlined/>} // 展开收缩图标
                // defaultExpandAll // 默认展开全部
                placeholder={props.placeholder}
                defaultValue={props.defaultValue}
                onChange={props.onChange} // 选择事件回调
                treeData={treeData} // 数据源
                fieldNames={{ // 自定义数据对应的结构
                    label: 'unit_name',
                    value: 'unit_id',
                    children: 'children',
                }}
                filterTreeNode={(inputValue, treeNode) => {
                    return new RegExp(inputValue.toLowerCase()).test(treeNode.title.toLowerCase())
                }}
            />
        </div>
        // <Select
        //     allowClear
        //     showSearch
        //     placeholder={props.placeholder}
        //     defaultValue={props.defaultValue}
        //     onChange={props.onChange}
        //     filterOption={(input, option) => {
        //         option.children.toLowerCase().includes(input.toLowerCase())
        //     }}
        // >
        //     {options}
        // </Select>
    )
}
