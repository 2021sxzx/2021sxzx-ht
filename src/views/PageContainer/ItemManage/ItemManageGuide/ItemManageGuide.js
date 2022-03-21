import React from 'react'
import api from '../../../../api/rule';
import ManageGuides from './components/ManageGuides'
import CreateGuide from './components/CreateGuide'
import {useState} from 'react'
import {Modal} from 'antd'

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

    return (
        <>
            {
                pageType === 1 &&
                <ManageGuides setPageType={setPageType} setModifyId={setModifyId}
                    setModifyContent={setModifyContent} showError={showError}/>
            }
            {
                pageType === 2 &&
                <CreateGuide setPageType={setPageType} modifyContent={modifyContent}/>
            }
        </>
    )
}
