import React, {useEffect, useState} from 'react'
import api from '../../../../api/rule';
import ManageRegions from './components/ManageRegions'
import CreateRegion from './components/CreateRegion'
import {Modal, message} from 'antd'

export default function ItemManageRegion(props) {
    // 页面的基础数据
    const [pageType, setPageType] = useState(1)
    // 记录正在修改的事项规则的id
    const [modifyPath, setModifyPath] = useState([])

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
                <ManageRegions regionNodes={props.regionNodes} regionDict={props.regionDict}
                    setPageType={setPageType} setModifyPath={setModifyPath} getRegionTree={props.getRegionTree} 
                    showError={showError} showSuccess={showSuccess}/>
            }
            {
                pageType === 2 &&
                <CreateRegion setPageType={setPageType} regionTree={props.regionTree}
                    regionRoot={props.regionRoot} getRegionTree={props.getRegionTree} modifyPath={modifyPath} 
                    showError={showError} showSuccess={showSuccess}/>
            }
        </>
    )
}
