import React, {useEffect, useState} from 'react'
import { Button, Tabs, List } from 'antd'
import api from '../../../api/rule'
import style from './Home.module.scss'
import VirtualList from 'rc-virtual-list'
const { TabPane } = Tabs
import UploadButton from "./uploadButton/UploadButton";

export default function Home(props) {
    /*const showFileInfo=(file,fileList)=>{
        console.log('showFileInfo',file,'fileList',fileList)
    }
    return (
        <div>
            <Button>button</Button>
            <UploadButton accept={'.csv, .xlsx'} handleFileInfo={showFileInfo} maxFileNum={1}>上传按钮</UploadButton>
        </div>
    )*/
    const [statusCount, setStatusCount] = useState([])
    const [checkResult, setCheckResult] = useState([])

    const getEveryItemStatusCount = ()=>{
        api.GetEveryItemStatusCount().then(response=>{
            setStatusCount(response.data.data)
        }).catch(error=>{

        })
    }

    const getCheckResult = ()=>{
        api.GetCheckResult().then(response=>{
            setCheckResult(response.data.data)
        }).catch(error=>{

        })
    }

    const jumpToProcess = (item)=>{
        props.history.push({pathname: '/item-manage/process', task_code: item})
    }

    const jumpToGuides = ()=>{
        props.history.push({pathname: '/item-manage/guide'})
    }

    useEffect(function(){
       getCheckResult()
       getEveryItemStatusCount() 
    }, [])

    return (
        <div className={style.flex}>
            <div className={style.checkResult}>
                <Tabs className={style.tabs} defaultActiveKey='0' tabPosition='top'>
                    {
                        checkResult.map((item, index)=>(
                            <TabPane tab={item.type + '(' + item.guides.length + ')'} key={index}>
                                <List className={style.list}>
                                    <VirtualList 
                                        height={430}
                                        data={item.guides}
                                    >
                                        {
                                            code=>(
                                                <List.Item className={style.listItem}>
                                                    <div>
                                                        {'    指南编码：'}
                                                    </div>
                                                    <div className={style.jumpCode} onClick={function(){
                                                        if (item.type === '省政务新增'){
                                                            jumpToGuides()
                                                        }
                                                        else jumpToProcess(code)
                                                    }}>
                                                        {code}
                                                    </div>
                                                </List.Item>
                                            )
                                        }
                                    </VirtualList>
                                </List>
                            </TabPane>
                        ))
                    }
                </Tabs>
            </div>
            <div className={style.statusCount}>
                <List className={style.countList}
                    header={
                        <div className={style.header}>
                            事项状态
                        </div>
                    }>
                    {
                        statusCount.map((item, index)=>(
                            <List.Item className={style.listItem}>
                                {'    ' + item.status_name + '事项：' + item.count + '项'}
                            </List.Item>
                        ))
                    }
                </List>
            </div>
        </div>
    )
}
