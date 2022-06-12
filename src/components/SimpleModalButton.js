import React from "react";
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {Button, Modal} from "antd";
const {confirm} = Modal;

/**
 * 自带对话框的按钮，可通过 props 自定义该组件，默认为删除的按钮和确认对话框
 * @param props={
 *     buttonProps:object = {
 *         shape:"circle",
 *         icon:{<DeleteOutlined/>},
 *     }, // antd Button 的 API
 *     buttonText:string = undefined, // 删除按钮的文字
 *     deleteCallback:function|undefined, // 对话框确认按钮的回调
 *     cancelCallback:function|undefined, // 对话框取消按钮的回调
 *     title:string = `是否确认删除?`, // 对话框标题
 *     icon:ReactNode = <ExclamationCircleOutlined/>, // 对话框图标
 *     content:string|ReactNode|undefined = undefined, // 对话框内容
 *     okText:string = '删除', // 对话框确认按钮文字
 *     okType:buttonType = 'danger', // 对话框确认按钮类型
 *     cancelText:string = '取消’, // 对话框取消按钮
 * }
 * @return {JSX.Element}
 * @constructor
 */
function SimpleModalButton(props) {
    const buttonProps = props.buttonProps?props.buttonProps:{
        shape:"circle",
        icon:<DeleteOutlined/>,
    }

    const showDeleteConfirm = () => {
        confirm({
            title: props.title?props.title:`是否确认删除?`,
            icon: props.icon?props.icon:<ExclamationCircleOutlined/>,
            content: props.content?props.content:undefined,
            okText: props.okText?props.okText:'删除',
            okType: props.okType?props.okType:'danger',
            cancelText: props.cancelText?props.cancelText:'取消',

            onOk() {
                props.deleteCallback?props.deleteCallback():null
            },
            onCancel() {
                props.cancelCallback?props.cancelCallback():null
            },
        })
    }

    return (
        <Button
            {...buttonProps}
            onClick={() => {
                showDeleteConfirm()
            }}
        >{props.buttonText}</Button>
    )
}

export default React.memo(SimpleModalButton)
