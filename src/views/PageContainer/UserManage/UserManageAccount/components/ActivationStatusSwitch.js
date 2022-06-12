import React, {useState} from "react";
import {message, Switch} from "antd";
import api from '../../../../../api/user'

/**
 * 切换用户激活状态的开关
 * @param props = {
 *     record: {
 *         usr_name:String,
 *         //...
 *         activation_status:Number,
 *     },
 *     refreshTableData: function(), // 刷新表格数据的回调函数
 * }
 * @returns {JSX.Element|string}
 * @constructor
 */
export default function ActivationStatusSwitch(props) {
    const record = props.record
    const [activationStatus, setActivationStatus] = useState(record.activation_status);
    const roleName = record.role_name
    /**
     * 切换账号激活状态。状态码为 1 表示激活，为 0 表示未激活
     * @param checked :switch 是否被选中
     */
    const handleSwitchChangeActivationState = (checked) => {
        const data = {
            account: record.account,
        }

        api.SetActivation(data).then(() => {
            setActivationStatus(checked)
            message.success('切换账号激活状态成功')
        }).catch(error => {
            console.log("error: handleSwitchChangeActivationState", error);
            message.error('切换账号激活状态失败')
        }).finally(() => {
            // 刷新表格数据
            props.refreshTableData()
        })
    }

    const disableSwitch = () => {
        return record._id === localStorage.getItem('_id') || roleName === localStorage.getItem('roleName')
    }

    if (activationStatus === false || activationStatus === true || activationStatus === 1 || activationStatus === 0) {
        // console.log("roleName === Cookie.getCookie('roleName')", roleName === Cookie.getCookie('roleName'), roleName)
        // console.log('role_name', localStorage.getItem('role_name'))
        return <Switch
            disabled={disableSwitch()}
            checkedChildren={"已激活"}
            unCheckedChildren={"未激活"}
            defaultChecked={activationStatus === true || activationStatus === 1}
            onChange={handleSwitchChangeActivationState}
        />
    } else {
        console.log('activationStatus', activationStatus)
        return <div>error status</div>
    }
}
