import React, {useEffect, useState} from 'react'
import api from '../../../../api/rule';
import ManageRegions from './components/ManageRegions'
import CreateRegion from './components/CreateRegion'
import {Modal, message} from 'antd'

export default function ItemManageRegion(props) {
    // 页面的基础数据
    const [pageType, setPageType] = useState(1)
    // 记录正在修改的事项规则的id
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

    return (
        <>
            {
                pageType === 1 &&
                <ManageRegions regionNodes={props.regionNodes} regionDict={props.regionDict} regionTree={props.regionTree}
                    setPageType={setPageType} setUpdatePath={setUpdatePath} getRegionTree={props.getRegionTree} 
                    showError={showError} showSuccess={showSuccess}
                    deleteRegionSimulate={props.deleteRegionSimulate}/>
            }
            {
                pageType === 2 &&
                <CreateRegion setPageType={setPageType} regionTree={props.regionTree}
                    regionRoot={props.regionRoot} getRegionTree={props.getRegionTree} updatePath={updatePath} 
                    showError={showError} showSuccess={showSuccess} updateRegionSimulate={props.updateRegionSimulate}
                    createRegionSimulate={props.createRegionSimulate}/>
            }
        </>
    )
}
