import { Checkbox, Divider, Form, message, Radio} from "antd";
import React, {useContext} from "react";
import api from "../../../../../api/log";
import {journalContext} from '../SystemManageJournal'

const SimpleSelectForm = () => {
    const [selectForm] = Form.useForm();
    const {setTableData, setTableLoading} = useContext(journalContext)

    // 表单初始化数据
    const initialValues = {
        selectMyself: false,
        selectTimeRange: 'all'
    }

    // 简易查询
    const onSearch = () => {
        // 设置表格加载状态
        setTableLoading(true)

        api.SearchLog({
            myselfID: selectForm.getFieldValue('selectMyself') ? localStorage.getItem("_id") : '',
            today: selectForm.getFieldValue('selectTimeRange') === 'today',
            thisWeek: selectForm.getFieldValue('selectTimeRange') === 'week',
        }).then((response) => {
            setTableData(response.data.data)
            message.success('查询日志成功')
        }).catch(() => {
            message.error('查询日志失败，请稍后尝试')
        }).finally(() => {
            // 设置表格加载状态
            setTableLoading(false)
        })
    };

    return (
        <Form
            form={selectForm}
            layout={"inline"}
            initialValues={initialValues}
            onChange={onSearch}
        >
            <Form.Item
                name={'selectMyself'}
                valuePropName="checked"
                label={'操作人为您'}
            >
                <Checkbox/>
            </Form.Item>

            <Form.Item>
                {/*分割线*/}
                <Divider type="vertical"/>
            </Form.Item>

            <Form.Item
                label={'时间范围'}
                name={'selectTimeRange'}
            >
                <Radio.Group>
                    <Radio value={'today'}>今天内</Radio>
                    <Radio value={'week'}>最近一周</Radio>
                    <Radio value={'all'}>全部时间</Radio>
                </Radio.Group>
            </Form.Item>
        </Form>
    )
}

export default SimpleSelectForm
