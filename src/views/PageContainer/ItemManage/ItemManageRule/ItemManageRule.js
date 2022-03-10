import React, {useEffect, useState} from 'react'
import api from '../../../../api/rule';
import ManageRules from './components/ManageRules'
import CreateRule from './components/CreateRule'
import {Modal, message} from 'antd'

export default function ItemManageRule(props) {
    // 页面的基础数据
    const [pageType, setPageType] = useState(1)
    // 记录正在修改的事项规则的id
    const [modifyId, setModifyId] = useState('')

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
                <ManageRules ruleNodes={props.ruleNodes} regionNodes={props.regionNodes}
                    setPageType={setPageType} setModifyId={setModifyId} init={props.init} 
                    showError={showError} showSuccess={showSuccess}/>
            }
            {
                pageType === 2 &&
                <CreateRule setPageType={setPageType} ruleTree={props.ruleTree} regionTree={props.regionTree}
                    ruleRoot={props.ruleRoot} regionRoot={props.regionRoot} init={props.init} modifyId={modifyId} 
                    showError={showError} showSuccess={showSuccess}/>
            }
        </>
    )
}
