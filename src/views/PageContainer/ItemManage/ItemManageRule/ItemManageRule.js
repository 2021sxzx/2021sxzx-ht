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

    const showError = (info)=>{ 
        Modal.error({
            title: '出错啦！',
            content: info,
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
                <ManageRules ruleNodes={props.ruleNodes} ruleTree={props.ruleTree} getRuleTree={props.getRuleTree} 
                    bindedData={props.bindedData} setBindedData={props.setBindedData} jumpToProcess={props.jumpToProcess}
                    setPageType={setPageType} setUpdatePath={setUpdatePath} 
                    showError={showError} showSuccess={showSuccess}
                    deleteRuleSimulate={props.deleteRuleSimulate}/>
            }
            {
                pageType === 2 &&
                <CreateRule ruleTree={props.ruleTree} ruleNodes={props.ruleNodes} ruleRoot={props.ruleRoot} 
                    getRuleTree={props.getRuleTree} setPageType={setPageType} updatePath={updatePath} 
                    showError={showError} showSuccess={showSuccess} userId={props.userId}
                    createRuleSimulate={props.createRuleSimulate} updateRuleSimulate={props.updateRuleSimulate}/>
            }
        </>
    )
}
