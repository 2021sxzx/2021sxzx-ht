import React, { useEffect, useState } from 'react'
import ManageProcess from './components/ManageProcess'
import CreateProcess from './components/CreateProcess'
import { Modal, message } from 'antd'
import api from '../../../../api/rule'
import { useRef } from 'react'

export default function ItemManageProcess(props) {
    // 页面的基础数据
    const [pageType, setPageType] = useState(1)
    const [canOperate, setCanOperate] = useState([])

    const searchData = useRef({})

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

    useEffect(function(){
        // 获取该账号身份可以访问的事项状态
        api.GetUserRank({
            user_id: localStorage.getItem('_id')
        }).then(response=>{
            let data = response.data.data.manage_status
            setCanOperate(data)
        }).catch(error=>{
            showError('获取可操作事项状态失败！')
        })
    }, [])

    return (
        <>
            {
                pageType === 1 &&
                <ManageProcess setPageType={setPageType} canOperate={canOperate}
                    ruleRoot={props.ruleRoot} regionRoot={props.regionRoot} userId={props.userId}
                    showError={showError} showSuccess={showSuccess} jumpCode={props.jumpCode} setJumpCode={props.setJumpCode}
                    bindedData={props.bindedData} setBindedData={props.setBindedData} searchData={searchData}/>
            }
            {
                pageType === 2 &&
                <CreateProcess setPageType={setPageType} ruleTree={props.ruleTree} regionTree={props.regionTree} userId={props.userId}
                    ruleRoot={props.ruleRoot} regionRoot={props.regionRoot}
                    showError={showError} showSuccess={showSuccess}/>
            }
        </>
    )
}
