import React, { useEffect } from 'react'
import api from '../../../../api/rule';
import ManageProcess from './components/ManageProcess'
import CreateProcess from './components/CreateProcess'
import {useState} from 'react'
import {Modal} from 'antd'

export default function ItemManageProcess(props) {
    // 页面的基础数据
    const [pageType, setPageType] = useState(1)
    const [modifyId, setModifyId] = useState('')
    const [modifyContent, setModifyContent] = useState({})

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
                <ManageProcess setPageType={setPageType} setModifyId={setModifyId}
                    setModifyContent={setModifyContent} showError={showError}/>
            }
            {
                pageType === 2 &&
                <CreateProcess setPageType={setPageType} ruleTree={props.ruleTree} regionTree={props.regionTree}
                ruleRoot={props.ruleRoot} regionRoot={props.regionRoot} init={props.init} modifyId={modifyId} 
                showError={showError} showSuccess={showSuccess}/>
            }
        </>
    )
}
