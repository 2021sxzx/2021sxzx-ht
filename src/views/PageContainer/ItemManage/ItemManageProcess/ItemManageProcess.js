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
            title: 'error',
            content: 'error',
            centered: true
        })
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
                <CreateProcess setPageType={setPageType} modifyContent={modifyContent}/>
            }
        </>
    )
}
