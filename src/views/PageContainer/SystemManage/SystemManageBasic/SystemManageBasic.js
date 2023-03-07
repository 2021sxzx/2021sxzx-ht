import {useEffect, useState} from 'react'
import {Button, Form, Input, InputNumber, message, Table, Tabs, Tag} from 'antd'
import api from '../../../../api/systemBasic'

/**
 * 自用反馈信息，适用于在正常情况下返回true，错误情况下返回错误信息的服务器接口
 * @param result - 服务器返回的信息
 * @param success - 成功时的提示信息
 * @param fail - 失败时的提示信息
 * @param fault - 程序错误时的提示信息
 * @param faultForConsole - 程序错误时向控制台输出的信息
 */
function feedback(result, success, fail, fault, faultForConsole) {
    if (typeof result === 'boolean') if (result) {
        message.success(success).then()
    } else {
        // 正常情况下不能运行到此句
        message.info(fault).then()
        console.error(faultForConsole)
    } else message.info(fail).then()
}

const NumericInput = props => {
    return <InputNumber {...props} controls={false} onChange={inputValue => {
        if (/^\d*$/.test(inputValue)) props.setValue(inputValue)
    }}/>
}

const BusinessData = props => <>
    <p>咨询电话
        <NumericInput value={props.value} setValue={props.setValue} maxLength={11} style={{width: '8em'}}/>
        <Button
            type="primary"
            onClick={async function () {
                const result = (await api.setTel({data: props.value})).data
                feedback(result, '咨询电话修改成功', `咨询电话修改失败，服务器返回信息：${result}`, '咨询电话的修改因未知原因失败', `严重的程序错误：setTel接口返回${result}，但修改成功应返回true，修改失败应返回捕获的错误原因`)
            }}>确认修改</Button>
    </p>
    <p>事项状态
        <Tag>未绑定</Tag>
        <Tag>已绑定</Tag>
        <Tag>未提交审核</Tag>
        <Tag>一级审核员审核中</Tag>
        <Tag>二级审核员审核中</Tag>
        <Tag>审核通过</Tag>
        <Tag>撤回待审核</Tag>
    </p>
    <a onClick={() => {
            window.open('/public/xlsx/运维手册.pdf')
        }}>点击下载运维手册</a>
    {/* 别震惊了，确实就是写死的，写这里的时候状态没有修改的需求 */}
</>

function HotKeyManagement() {
    const [hotKeys, setHotKeys] = useState()

    function getHotKeys() {
        api.getHotKeys().then(({data}) => setHotKeys(data.map((hotKey, key) => ({key, hotKey}))))
    }

    useEffect(getHotKeys, [])
    return <>
        <Form name="hotKeyForm" layout="inline" onFinish={async ({hotKey}) => {
            const result = (await api.addHotKey({data: hotKey})).data
            feedback(result, '添加热词成功', `添加热词失败，服务器返回信息：${result}`, '添加热词因未知原因失败', `严重的程序错误：addHotKey接口返回${result}，但修改成功应返回true，修改失败应返回捕获的错误原因`)
            getHotKeys()
        }}>
            <Form.Item name="hotKey" rules={[{required: true, message: '请输入欲添加的热词'}]}>
                <Input placeholder="欲添加的热词"
                       maxLength={128}
                       showCount
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">添加热词</Button>
            </Form.Item>
        </Form>
        <Table
            columns={[
                {title: '热词', dataIndex: 'hotKey'},
                {
                    render: (_, {hotKey}) => <Button onClick={async () => {
                        const result = (await api.deleteHotKey({data: hotKey})).data
                        feedback(result, '删除热词成功', `删除热词失败，服务器返回信息：${result}`, '删除热词因未知原因失败', `严重的程序错误：deleteHotKey接口返回${result}，但修改成功应返回true，修改失败应返回捕获的错误原因`)
                        getHotKeys()
                    }}>删除</Button>
                }
            ]}
            dataSource={hotKeys}/>
    </>
}

const {TabPane} = Tabs
export default function SystemManageBasic() {
    const [value, setValue] = useState('')
    useEffect(async () => {
        setValue((await api.getTel()).data)
    }, [])
    return <div className="card-container">
        <Tabs type="card">
            <TabPane tab="业务数据" key="1"><BusinessData value={value} setValue={setValue}/></TabPane>
            <TabPane tab="热词管理" key="2"><HotKeyManagement/></TabPane>
        </Tabs>
    </div>
}
