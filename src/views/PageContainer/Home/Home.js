import React, {useEffect, useState} from 'react'
import {Tabs, List, message, Button} from 'antd'
import api from '../../../api/rule'
import style from './Home.module.scss'
import VirtualList from 'rc-virtual-list'
import apiPersonal from "../../../api/personal";
import apiRole from "../../../api/role";

const {TabPane} = Tabs

export default function Home(props) {
    const [statusCount, setStatusCount] = useState([])
    const [checkResult, setCheckResult] = useState([])
    const [permission, setPermission] = useState([])
    const [shouldUpdate, setShouldUpdate] = useState(false)

    useEffect(() => {
        apiPersonal.getTopHeaderData()
            .then(value => {
                apiRole.GetRole().then((res) => {
                    for (let item of res.data.data) {
                        if (item.role_name === value.data.data.role_name) {
                            setPermission(item.permission)
                            break
                        }
                    }
                }).catch(() => {
                    message.error("获取用户信息失败")
                })
            }).catch(() => {
                message.error('获取 topHeader 信息失败')
        })
    }, []);

    useEffect(function () {
        getCheckResult()
        getEveryItemStatusCount()
    }, [])

    useEffect(function () {
        if (checkResult.length !== 0)
            api.UpdateCheckResult(checkResult).then(response => {
                setCheckResult(response.data.data)
            }).catch(() => {

            })
    }, [shouldUpdate])

    const getEveryItemStatusCount = () => {
        api.GetEveryItemStatusCount().then(response => {
            setStatusCount(response.data.data)
        }).catch(() => {
        })
    }

    const getCheckResult = () => {
        api.GetCheckResult().then(response => {
            setCheckResult(response.data.data)
        }).catch(() => {

        })
    }

    const jumpToProcess = (item) => {
        props.history.push({pathname: '/item-manage/process', task_code: item})
    }

    const jumpToGuides = () => {
        props.history.push({pathname: '/item-manage/guide'})
    }


    return (
        <div className={style.flex}>
            <div className={style.checkResult}>
                <Tabs className={style.tabs} defaultActiveKey='0' tabPosition='top' id="tabss">
                    {
                        checkResult.map((item, index) => (
                            <TabPane tab={item.type + '(' + item.guides.length + ')'} key={item.type}>

                                <List className={style.list}>
                                    <VirtualList
                                        height={430}
                                        data={item.guides}
                                        itemKey={item.guides}
                                    >
                                        {
                                            (code, num) => (
                                                <List.Item className={style.listItem} key={item.guides[num]}>
                                                    <div>
                                                        {index === 0 ? "指南编码：" : item.item_name[num] + '：'}
                                                    </div>
                                                    <div className={style.jumpCode}
                                                         style={{color: item.handle[num] ? 'auto' : '#A9A9A9'}}
                                                         onClick={function () {
                                                             if (permission.indexOf("事项指南管理") !== -1)
                                                                 if (item.type === '省政务新增') {
                                                                     jumpToGuides()
                                                                 } else jumpToProcess(code)
                                                         }}>
                                                        {code}
                                                    </div>
                                                    {
                                                        <Button type='primary' className={style.handled}
                                                                style={{display: item.handle[num] ? 'block' : 'none'}}
                                                                onClick={() => {
                                                                    let arr = item.handle
                                                                    arr[num] = 0
                                                                    setShouldUpdate(!shouldUpdate)
                                                                }}>已处理</Button>
                                                    }

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
                        statusCount.map((item) => (
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
