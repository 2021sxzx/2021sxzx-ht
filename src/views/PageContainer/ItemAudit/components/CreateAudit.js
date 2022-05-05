import React, { useState } from 'react'
import style from './CreateAudit.module.scss'
import {Table, Button, Space, Input, Modal} from 'antd'
import api from '../../../../api/rule'
const { TextArea } = Input

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
        if (comment === ''){
            Modal.warning({
                title: '未输入意见',
                content: '请输入审核意见！',
                centered: true
            })
            return
        }
        else if (inj_judge(comment)){
            Modal.warning({
                centered: true,
                title: '非法输入',
                content: '输入信息中有非法输入内容，请检查输入！'
            })
        }
        else{
            Modal.confirm({
                title: '确认审核',
                content: '    您的审核意见为“' + comment + '”，\n' + '    确定不通过审核吗？',
                centered: true,
                style: {whiteSpace: 'pre-wrap'},
                onOk: function(){
                    changeItemStatus(props.statusScheme[props.auditingStatus].next_status.reject, 'reject')
                }
            })
        }
    }

    const handleAuditing = ()=>{
        if (comment === ''){
            Modal.warning({
                title: '未输入意见',
                content: '请输入审核意见！',
                centered: true
            })
            return
        }
        else if (inj_judge(comment)){
            Modal.warning({
                centered: true,
                title: '非法输入',
                content: '输入信息中有非法输入内容，请检查输入！'
            })
        }
        else{
            Modal.confirm({
                title: '确认审核',
                content: '    您的审核意见为“' + comment + '”，\n' + '    确定通过审核吗？',
                centered: true,
                style: {whiteSpace: 'pre-wrap'},
                onOk: function(){
                    changeItemStatus(props.statusScheme[props.auditingStatus].next_status.next, 'pass')
                }
            })
        }
    }

    const changeItemStatus = (next_status, choice)=>{
        // 审核通过
        api.ChangeItemStatus({
            user_id: props.userId,
            items: [{
                item_id: props.auditingId,
                next_status: next_status
            }]
        }).then(response=>{
            addAuditAdvise(choice)
        }).catch(error=>{
            props.showError('变更状态失败！')
        })
    }

    const inj_judge = (str)=>{
        let inj_str = ['delete', 'and', 'exec', 'insert', 'update', 'count', 'master', 'select',
            'char', 'declare', 'or', '|', 'delete', 'not', '/*', '*/', 'find']
        for (let i = 0; i < inj_str.length; i++){
            if (str.indexOf(inj_str[i]) >= 0){
                return true
            }
        }
        return false
    }

    const addAuditAdvise = (choice)=>{
        api.AddAuditAdvise({
            item_id: props.auditingId,
            user_id: props.userId,
            advise: ('（' + props.statusScheme[props.auditingStatus].cn_name + (choice === 'pass' ? '）（通过）' : '）（不通过）') + comment)
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
                <Button style={{backgroundColor: 'red', color: 'white'}} onClick={handleRejection}>
                    审核不通过  
                </Button>
                <Button type='primary' onClick={handleAuditing}>
                    审核通过   
                </Button>
            </Space>
        </Space>
                
    )
}
