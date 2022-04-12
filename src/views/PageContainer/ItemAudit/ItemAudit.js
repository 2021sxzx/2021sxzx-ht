import React, { useEffect, useState } from 'react'
import ManageAudit from './components/ManageAudit'
import CreateAudit from './components/CreateAudit'
import {Modal, message} from 'antd'
import api from '../../../api/rule'

export default function ItemAudit() {
    const [pageType, setPageType] = useState(1)
    const [ruleNodes, setRuleNodes] = useState({})
    const [regionNodes, setRegionNodes] = useState({})
    const [auditingData, setAuditingData] = useState({})
    const [auditingId, setAuditingId] = useState('')

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

    const getRuleNodes = ()=>{
        api.GetRuleTree({}).then(response=>{
            let nodes = response.data.data
            setRuleNodes(nodes)
        }).catch(error=>{

        })
    }

    const getRegionNodes = ()=>{
        api.GetRegionTree({}).then(response=>{
            let nodes = response.data.data
            setRegionNodes(nodes)
        }).catch(error=>{
            
        })
    }

    useEffect(function(){
        getRuleNodes()
        getRegionNodes()
    }, [])

    useEffect(function(){
        if (auditingId === '') return
        if (auditingData.length === 0) return
        setPageType(2)
    }, [auditingData, auditingId])

    return (
        <>
            {
                pageType === 1 &&
                <ManageAudit regionNodes={regionNodes} ruleNodes={ruleNodes}
                    setAuditingData={setAuditingData} setAuditingId={setAuditingId}
                    setPageType={setPageType} showError={showError} showSuccess={showSuccess}/>
            }
            {
                pageType === 2 && 
                <CreateAudit auditingData={auditingData} auditingId={auditingId}
                setAuditingData={setAuditingData} setAuditingId={setAuditingId}
                    setPageType={setPageType} showError={showError} showSuccess={showSuccess}/>
            }
        </>
    )
}
