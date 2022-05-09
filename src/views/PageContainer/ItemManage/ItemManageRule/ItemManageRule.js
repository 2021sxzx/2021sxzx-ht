import React, { useEffect, useState } from 'react'
import ManageRules from './components/ManageRules'
import CreateRule from './components/CreateRule'
import { Modal, message } from 'antd'

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

    useEffect(function(){
        if (updatePath.length === 0) return
        setPageType(2)
    }, [updatePath])

    return (
        <>
            {
                pageType === 1 &&
                <ManageRules bindedData={props.bindedData} setBindedData={props.setBindedData} jumpToProcess={props.jumpToProcess}
                    setPageType={setPageType} setUpdatePath={setUpdatePath} ruleRoot={props.ruleRoot}
                    showError={showError} showSuccess={showSuccess}/>
            }
            {
                pageType === 2 &&
                <CreateRule ruleRoot={props.ruleRoot} userId={props.userId}
                    setPageType={setPageType} updatePath={updatePath} 
                    showError={showError} showSuccess={showSuccess} />
            }
        </>
    )
}
