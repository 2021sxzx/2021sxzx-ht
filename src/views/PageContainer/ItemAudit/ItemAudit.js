import React, { useEffect, useState } from 'react'
import ManageAudit from './components/ManageAudit'
import CreateAudit from './components/CreateAudit'
import {Modal, message} from 'antd'
import api from '../../../api/rule'

export default function ItemAudit() {
    const [pageType, setPageType] = useState(1)
    const [userId, setUserId] = useState('')
    const [ruleNodes, setRuleNodes] = useState({})
    const [regionNodes, setRegionNodes] = useState({})
    const [canOperate, setCanOperate] = useState([])
    const [canSee, setCanSee] = useState([])
    const [statusType, setStatusType] = useState([])
    // 点击审核后保存正在审核事项的信息
    const [auditingData, setAuditingData] = useState({})
    const [auditingId, setAuditingId] = useState('')
    const [auditingStatus, setAuditingStatus] = useState('')
    // 状态映射表
    const [statusScheme, setStatusScheme] = useState({})
    const [statusId, setStatusId] = useState({})

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

    const getItemstatusScheme = ()=>{
        api.GetItemStatusScheme({}).then(response=>{
            // 获取状态表
            let scheme = response.data.data
            let WordToName = {}
            for (let key in scheme){
                // 状态码对状态名和相关按钮的映射
                WordToName[scheme[key].eng_name] = key
            }
            setStatusScheme(scheme)
            setStatusId(WordToName)
        }).catch(error=>{
            props.showError('初始化状态表失败！')
        })
    }

    useEffect(function(){
        getRuleNodes()
        getRegionNodes()
        setUserId(localStorage.getItem('_id'))
    }, [])

    useEffect(function(){
        // 初始化可见和可操作数组
        for (let key in statusScheme){
            api.GetUserRank({
                user_id: localStorage.getItem('_id')
            }).then(response=>{
                let data = response.data.data
                setCanOperate(data.can_operate)
                // TODO: 加一个类似canAudit的字段取代canSee
                let temp_can_see = [1, 2, 5]
                setCanSee(temp_can_see)
                let types = []
                for (let i = 0; i < temp_can_see.length; i++){
                    types.push({
                        label: statusScheme[temp_can_see[i]].cn_name,
                        value: temp_can_see[i]
                    })
                }
                setStatusType(types)
            }).catch(error=>{
                showError('可操作事项状态获取失败！')
            })
            break
        }
    }, [statusScheme])

    useEffect(function(){
        for (let key in ruleNodes){
            for (let key in regionNodes){
                getItemstatusScheme()
                break
            }
            break
        }
    }, [ruleNodes, regionNodes])

    useEffect(function(){
        if (auditingId === '') return
        if (auditingData.length === 0) return
        setPageType(2)
    }, [auditingData, auditingId])

    return (
        <>
            {
                pageType === 1 &&
                <ManageAudit regionNodes={regionNodes} ruleNodes={ruleNodes} canOperate={canOperate} canSee={canSee}
                    setAuditingData={setAuditingData} setAuditingId={setAuditingId} setAuditingStatus={setAuditingStatus}
                    setPageType={setPageType} showError={showError} showSuccess={showSuccess}
                    statusId={statusId} statusScheme={statusScheme} statusType={statusType} />
            }
            {
                pageType === 2 && 
                <CreateAudit auditingData={auditingData} auditingId={auditingId} auditingStatus={auditingStatus}
                    setAuditingData={setAuditingData} setAuditingId={setAuditingId} setAuditingStatus={setAuditingStatus} 
                    setPageType={setPageType} showError={showError} showSuccess={showSuccess}
                    statusId={statusId} statusScheme={statusScheme} userId={userId} />
            }
        </>
    )
}
