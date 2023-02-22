import {message, Space} from 'antd'
import React from 'react'
import style from './TagsArea.module.scss'

export default function TagsArea(props) {
    return (
        <Space className={style.tagsArea} direction='vertical' size={5}>
            {
                props.tags && props.tags.length !== 0 &&
                props.tags.map((tag, index) => {
                        if (props.isRuleCreating === true && tag.hasBindItem === true) {
                            // 处于创建规则流程而且该规则节点该节点下已经直接绑定了事项
                            // 就不允许在该节点下创建新规则节点。
                            return (
                                <div
                                    className={style.tag}
                                    key={props.type + '_' + tag.nodeId}
                                    style={{
                                        backgroundColor: 'gray',
                                    }}
                                    onClick={
                                        () => {
                                            message.warn('该节点下已经直接绑定了事项，不允许在该节点下创建新规则节点。')
                                        }
                                    }>
                                    <div className={style.tagContent}>
                                        {tag.nodeName}
                                    </div>
                                </div>
                            )
                        } else {
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
                    }
                )
            }
        </Space>
    )
}
