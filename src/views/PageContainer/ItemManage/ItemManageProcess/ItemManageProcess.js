import React, { useEffect } from 'react'
import api from '../../../../api/rule';
import ManageProcess from './components/ManageProcess'
import CreateProcess from './components/CreateProcess'
import {useState} from 'react'
import {Modal, message} from 'antd'

export default function ItemManageProcess(props) {
    // 页面的基础数据
    const [pageType, setPageType] = useState(1)
    const [modifyId, setModifyId] = useState('')
    const [modifyContent, setModifyContent] = useState({})

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
                <ManageProcess setPageType={setPageType} setModifyId={setModifyId} setModifyContent={setModifyContent}
                    ruleNodes={props.ruleNodes} regionNodes={props.regionNodes} userId={props.userId}
                    showError={showError} showSuccess={showSuccess}
                    bindedData={props.bindedData} setBindedData={props.setBindedData}/>
            }
            {
                pageType === 2 &&
                <CreateProcess setPageType={setPageType} ruleTree={props.ruleTree} regionTree={props.regionTree} userId={props.userId}
                ruleRoot={props.ruleRoot} regionRoot={props.regionRoot} init={props.init} modifyId={modifyId} 
                showError={showError} showSuccess={showSuccess}/>
            }
        </>
    )
}
