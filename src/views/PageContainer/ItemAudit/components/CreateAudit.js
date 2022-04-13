import React, { useEffect, useState } from 'react'
import style from './CreateAudit.module.scss'
import {Table, Button, Space, Input} from 'antd'
import api from '../../../../api/rule'
const {TextArea} = Input

export default function CreateAudit(props) {
    const [comment, setComment] = useState('')
    const [statusUpdated, setStatusUpdated] = useState(false)

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
        // 审核不通过
        api.ChangeItemStatus({
            user_id: props.userId,
            items: [{
                item_id: props.auditingId,
                next_status: props.statusScheme[props.auditingStatus].next_status.reject
            }]
        }).then(response=>{
            addAuditAdvise()
        }).catch(error=>{
            props.showError('变更状态失败！')
        })
    }

    const handleAuditing = ()=>{
        // 审核通过
        api.ChangeItemStatus({
            user_id: props.userId,
            items: [{
                item_id: props.auditingId,
                next_status: props.statusScheme[props.auditingStatus].next_status.next
            }]
        }).then(response=>{
            addAuditAdvise()
        }).catch(error=>{
            props.showError('变更状态失败！')
        })
    }

    const addAuditAdvise = ()=>{
        api.AddAuditAdvise({
            item_id: props.auditingId,
            user_id: props.userId,
            advise: comment
        }).then(response=>{
            props.showSuccess()
            props.setPageType(1)
        }).catch(error=>{
            props.showError('上传审核意见失败！')
            props.setPageType(1)
        })
    }

    return (
        <Space size={20} direction='vertical' className={style.mainSpace}>
            <Table className={style.table}
                columns={detailColumns} dataSource={props.auditingData} rowKey='detailType'
                pagination={{pageSize: 20, hideOnSinglePage: true}} />
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
