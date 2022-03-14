import React, {useState} from "react";
import {Switch} from "antd";
import api from '../../../../../api/user'
/**
 * 切换用户激活状态的开关
 * @param props = {
 *     record = {
 *         usr_name:String,
 *         //...
 *         activation_status:Number,
 *     }
 * }
 * @returns {JSX.Element|string}
 * @constructor
 */
export default function ActivationStatusSwitch (props){
    const record = props.record
    const [activationStatus, setActivationStatus] = useState(record.activation_status)

    /**
     * 切换账号激活状态。状态码为 1 表示激活，为 0 表示未激活
     * @param checked :switch 是否被选中
     */
    const handleSwitchChangeActivationState = (checked) => {
        // setActivationStatus(checked ? 1 : 0)
        // console.log("Activation Status = ", activationStatus)

        const data = {
            account: record.account,
        }

        // TODO wait for api
        api.SetActivation(data).then(response => {
            // log 服务端返回的搜索结果
            console.log('SetActivation=', response.data)
            setActivationStatus(response.data.data.activation_status)

        }).catch(error => {
            console.log("error: handleSwitchChangeActivationState",error)
        })
    }

    if (activationStatus === 0 || activationStatus === 1) {
        return <Switch
            checkedChildren={"已激活"}
            unCheckedChildren={"未激活"}
            defaultChecked={activationStatus===1}
            onChange={handleSwitchChangeActivationState}
        />
    } else {
        return <div>error status</div>
    }
}