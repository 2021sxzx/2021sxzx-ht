import {Space, Tooltip} from 'antd'
import React from 'react'
import style from './TagsArea.module.scss'

export default function TagsArea(props) {
    return (
        <Space className={style.tagsArea} direction='vertical' size={5}>
            {
                props.tags && props.tags.length > 0
                    ?
                    props.tags.map((tag, index) => {
                        switch (tag.nodeId) {
                            case '-1':
                                return (
                                    <Tooltip title={'请先绑定事项指南再使用推荐规则项功能'}>
                                        <div className={style.tag} key={props.type + '_' + tag.nodeId}>
                                            <div className={style.tagContent}>
                                                {tag.nodeName}
                                            </div>
                                        </div>
                                    </Tooltip>
                                )
                            case '-2':
                                return (
                                    <Tooltip title={'该规则下无相关推荐，如果有需要可尝试创建新规则项'}>
                                        <div className={style.tag} key={props.type + '_' + tag.nodeId}>
                                            <div className={style.tagContent}>
                                                {tag.nodeName}
                                            </div>
                                        </div>
                                    </Tooltip>
                                )
                            case '-3':{
                                return (
                                    <Tooltip title={'获取规则项推荐发生错误，请稍后重试'}>
                                        <div className={style.tag} key={props.type + '_' + tag.nodeId}>
                                            <div className={style.tagContent}>
                                                {tag.nodeName}
                                            </div>
                                        </div>
                                    </Tooltip>
                                )
                            }
                            default:
                                return (
                                    <div className={style.tag} key={props.type + '_' + tag.nodeId} onClick={
                                        () => {
                                            props.chooseTag(index, props.type)
                                        }
                                    }>
                                        <div className={style.tagContent}>
                                            {tag.nodeName}
                                        </div>
                                    </div>
                                )
                        }
                    })
                    :
                    <div/>
            }
        </Space>
    )
}
