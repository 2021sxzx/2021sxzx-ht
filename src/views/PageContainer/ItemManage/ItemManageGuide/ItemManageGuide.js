import React from 'react'
import api from '../../../../api/rule';
import ManageGuides from './components/ManageGuides'
import CreateGuide from './components/CreateGuide'
import {useState} from 'react'
import {Modal, message} from 'antd'

export default function ItemManageGuide(props) {
    // 页面的基础数据
    const [pageType, setPageType] = useState(1)
    const [modifyId, setModifyId] = useState('')
    const [modifyContent, setModifyContent] = useState({})

    const showError = ()=>{
        Modal.error({
            title: 'error',
            content: 'error',
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
                <ManageGuides setPageType={setPageType} setModifyId={setModifyId}
                    setModifyContent={setModifyContent} showError={showError} showSuccess={showSuccess}/>
            }
            {
                pageType === 2 &&
                <CreateGuide setPageType={setPageType} modifyContent={modifyContent}
                    showSuccess={showSuccess} showError={showError}/>
            }
        </>
    )
}
