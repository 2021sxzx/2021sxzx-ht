import React, { useEffect } from 'react'
import ManageGuides from './components/ManageGuides'
import CreateGuide from './components/CreateGuide'
import {useState} from 'react'
import {Modal, message} from 'antd'

export default function ItemManageGuide(props) {
    // 页面的基础数据
    const [pageType, setPageType] = useState(1)
    const [modifyId, setModifyId] = useState('')
    const [modifyContent, setModifyContent] = useState({})

    const showError = (info)=>{
        Modal.error({
            title: '出错啦',
            content: info,
            centered: true
        })
    }

    const showSuccess = ()=>{
        message.success('操作成功！')
    }

    useEffect(function(){
        for (let key in modifyContent){
            setPageType(2)
            break
        }
    }, [modifyContent])

    return (
        <>
            {
                pageType === 1 &&
                <ManageGuides setPageType={setPageType} setModifyId={setModifyId}
                    setModifyContent={setModifyContent} showError={showError} showSuccess={showSuccess}/>
            }
            {
                pageType === 2 &&
                <CreateGuide setPageType={setPageType} modifyContent={modifyContent} modifyId={modifyId}
                    showSuccess={showSuccess} showError={showError} userId={props.userId}/>
            }
        </>
    )
}
