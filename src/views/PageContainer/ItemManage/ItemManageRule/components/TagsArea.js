import { Space } from 'antd'
import React, {useEffect, useState} from 'react'
import style from './TagsArea.module.scss'

export default function TagsArea(props){
    return (
        <Space direction='vertical' size={5}>
            {
                props.tags.length != 0 &&
                props.tags.map((tag, index)=>
                    <div className={style.tag} style={{display: tag.disabled ? 'none' : 'flex'}}
                        key={props.type + '_' + tag.nodeId} onClick={
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