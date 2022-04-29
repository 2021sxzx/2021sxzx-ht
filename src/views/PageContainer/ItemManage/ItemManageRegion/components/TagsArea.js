import { Space } from 'antd'
import React from 'react'
import style from './TagsArea.module.scss'

export default function TagsArea(props){
    return (
        <Space className={style.tagsArea} direction='vertical' size={5}>
            {
                props.tags.length != 0 &&
                props.tags.map((tag, index)=>
                    <div className={style.tag} key={props.type + '_' + tag.nodeId} onClick={
                        value=>{
                            props.chooseTag(index, props.type)
                        }
                    }>
                        <div className={style.tagContent}>
                            {tag.nodeName}
                        </div>   
                    </div>
                )
            }
        </Space>        
    )
}