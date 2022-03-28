import React, {useEffect, useState} from 'react'
import api from '../../../../api/rule';
import ManageRules from './components/ManageRules'
import CreateRule from './components/CreateRule'
import {Modal, message} from 'antd'

export default function ItemManageRule(props) {
    // 页面的基础数据
    const [pageType, setPageType] = useState(1)
    // 记录正在修改的规则路径
    const [updatePath, setUpdatePath] = useState([])

    const showError = ()=>{ 
        Modal.error({
            title: '出错啦！',
            content: '本次操作出现了错误，请稍后重试！',
            centered: true
        })
    }

    const showSuccess = ()=>{
        message.success('操作成功！')
    }

    return (
        <>
            {
                pageType === 1 &&
                <ManageRules ruleNodes={props.ruleNodes} ruleTree={props.ruleTree}
                    setPageType={setPageType} setUpdatePath={setUpdatePath} getRuleTree={props.getRuleTree} 
                    showError={showError} showSuccess={showSuccess} ruleDict={props.ruleDict}
                    deleteRuleSimulate={props.deleteRuleSimulate}/>
            }
            {
                pageType === 2 &&
                <CreateRule setPageType={setPageType} ruleTree={props.ruleTree} ruleNodes={props.ruleNodes}
                    ruleRoot={props.ruleRoot} getRuleTree={props.getRuleTree} updatePath={updatePath} 
                    showError={showError} showSuccess={showSuccess}
                    createRuleSimulate={props.createRuleSimulate} updateRuleSimulate={props.updateRuleSimulate}/>
            }
        </>
    )
}
