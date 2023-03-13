import React, { useEffect, useState } from 'react'
import ManageRegions from './components/ManageRegions'
import CreateRegion from './components/CreateRegion'
import { Modal, message } from 'antd'
import { useRef } from 'react'

export default function ItemManageRegion(props) {
    // 页面的基础数据
    const [pageType, setPageType] = useState(1)
    // 记录正在修改的事项规则的id
    const [updatePath, setUpdatePath] = useState([])
    
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
        if (updatePath.length === 0) return
        setPageType(2)
    }, [updatePath])

    return (
        <>
            {
                pageType === 1 &&
                <ManageRegions regionRoot={props.regionRoot} setPageType={setPageType} setUpdatePath={setUpdatePath}
                    bindedData={props.bindedData} setBindedData={props.setBindedData} 
                    jumpToProcess={props.jumpToProcess} jumpToUnusual={props.jumpToUnusual}
                    showError={showError} showSuccess={showSuccess} searchData={searchData}/>
            }
            {
                pageType === 2 &&
                <CreateRegion setPageType={setPageType}  userId={props.userId}
                    regionRoot={props.regionRoot} updatePath={updatePath} 
                    showError={showError} showSuccess={showSuccess} />
            }
        </>
    )
}
