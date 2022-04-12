import React, { useEffect, useState } from 'react'
import style from './CreateAudit.module.scss'
import {Table, Button, Space, Input} from 'antd'
const {TextArea} = Input

export default function CreateAudit(props) {
    const [comment, setComment] = useState('')

    const detailColumns = [
        {
            title: '数据类型',
            dataIndex: 'detailType',
            key: 'detailType',
            width: '20%'
        },
        {
            title: '详细信息',
            dataIndex: 'detailInfo',
            key: 'detailInfo',
            width: '80%'
        }
    ]

    const handleCommentChange = (e)=>{
        setComment(e.target.value)
    }

    const handleCancel = ()=>{
        props.setAuditingData({})
        props.setAuditingId('')
        props.setPageType(1)
    }

    const handleRejection = ()=>{
        // TODO: 审核不通过
    }

    const handleAuditing = ()=>{
        // TODO: 审核通过
        console.log(comment)
    }

    return (
        <Space size={20} direction='vertical' className={style.mainSpace}>
            <Table className={style.table}
                columns={detailColumns} dataSource={props.auditingData} rowKey='detailType'
                pagination={{pageSize: 16, hideOnSinglePage: true}} />
            <div>
                <div className={style.commentTitle}>审核意见：</div>
                <TextArea autoSize={{minRows: 3}} value={comment} onChange={handleCommentChange} placeholder='请输入审核意见' /> 
            </div>            
            <Space size={50} direction='horizontal'>
                <Button onClick={handleCancel}>
                    取消    
                </Button>
                <Button className={style.redBtn} onClick={handleRejection}>
                    审核不通过  
                </Button>
                <Button type='primary' onClick={handleAuditing}>
                    审核通过   
                </Button>
            </Space>
        </Space>
                
    )
}
