import React, {useCallback, useEffect, useState} from "react";
import {
    DeleteOutlined,
    DownOutlined,
    EditOutlined, ExclamationCircleOutlined,
    MoreOutlined,
    PlusOutlined
} from '@ant-design/icons';
import {Button, message, Popover, Space, Tree, Modal} from 'antd';

import api from '../../../../../../api/unit'
import UnitModal from "./UnitModal";

const {confirm} = Modal;
/**
 *
 * @param props={
 *     selectUnitID:function, // 告诉上级组件所选的 unit_id
 * }
 * @return {JSX.Element}
 * @constructor
 */
const UnitList = (props) => {
    console.log('UnitList')
    const [treeData, setTreeData] = useState([])
    // const treeDataRef = useRef(treeData)

    const getUnitAndRefreshTree = useCallback(() => {
        api.GetUnit().then((res) => {
            setTreeData([res.data.data])
        })
    }, [])

    useEffect(() => {
        getUnitAndRefreshTree()
    }, [])

    const onSelect = (selectedKeys, info) => {
        // console.log('selected', selectedKeys, info.node.unit_id);
        props.selectUnitID(info.node.unit_id)
    };

    const showDeleteConfirm = (nodeData) => {
        confirm({
            title: `是否确认删除机构：${nodeData.unit_name}?`,
            icon: <ExclamationCircleOutlined/>,
            content: undefined,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',

            onOk() {
                api.DeletUnit({
                    unit_id: nodeData.unit_id
                }).then(() => {
                    message.success('删除机构成功')
                }).catch(() => {
                    message.error('删除机构失败，请重试')
                }).finally(() => {
                    getUnitAndRefreshTree()
                })
            },
            onCancel() {
                // console.log('Cancel')
            },
        })
    }

    const nodeRender = (nodeData) => {
        if (!nodeData) {
            return <div/>
        } else {
            return (
                <Space size={'small'}>
                    {nodeData.unit_name}
                    <div style={{
                        float: 'right',
                    }}>
                        {/*气泡卡片*/}
                        <Popover
                            placement={'rightTop'} // 气泡出现位置
                            trigger="hover" // 触发事件
                            mouseEnterDelay={0.1} // 鼠标移入后延时关闭
                            mouseLeaveDelay={0.1} // 鼠标移出后延时关闭
                            zIndex={100} // z index
                            content={( // 气泡内容
                                <div>
                                    <Space>
                                        {/*添加 unit*/}
                                        <UnitModal
                                            buttonProps={{
                                                shape: "circle",
                                                icon: <PlusOutlined/>,
                                            }}
                                            title={'新增下级机构'}
                                            detailData={{
                                                // 用于添加 unit
                                                unit_name: '',
                                                parent_unit: nodeData.unit_id,
                                                parent_name: nodeData.unit_name,
                                            }}
                                            callback={(data) => {
                                                api.AddUnit(data).then(() => {
                                                    message.success('添加下级部门成功')
                                                    getUnitAndRefreshTree()
                                                }).catch(() => {
                                                    message.error('添加下级部门失败，请重新尝试')
                                                    getUnitAndRefreshTree()
                                                })
                                            }}
                                        />
                                        {/*修改 unit*/}
                                        <UnitModal
                                            buttonProps={{
                                                shape: "circle",
                                                icon: <EditOutlined/>,
                                            }}
                                            title={'修改机构信息'}
                                            detailData={{
                                                // 用于修改 unit
                                                unit_name: nodeData.unit_name,
                                                unit_id: nodeData.unit_id,
                                            }}
                                            callback={(data) => {
                                                api.UpdateUnit(data).then(() => {
                                                    message.success('修改部门信息成功')
                                                    getUnitAndRefreshTree()
                                                }).catch(() => {
                                                    message.error('修改部门信息失败，请重新尝试')
                                                    getUnitAndRefreshTree()
                                                })
                                            }}
                                        />
                                        {/*删除 unit*/}
                                        <Button
                                            shape="circle"
                                            icon={<DeleteOutlined/>}
                                            onClick={() => {
                                                showDeleteConfirm(nodeData)
                                            }}
                                        />
                                    </Space>
                                </div>
                            )}
                        >
                            {/*图标*/}
                            <MoreOutlined/>
                        </Popover>
                    </div>
                </Space>
            )
        }
    }

    const handleRightClick = ({event, node}) => {
        console.log('event', event)
        console.log('node', node)
    }

    if(treeData.length > 0){
        return (
            <div>
                <Tree
                    showLine // 是否展示连接线
                    switcherIcon={<DownOutlined/>} // 展开收缩图标
                    defaultExpandedKeys={[treeData[0].unit_id]} // 默认展开的节点，这里是默认展开根节点
                    // defaultExpandAll // 默认展开全部
                    onSelect={onSelect} // 选择事件回调
                    treeData={treeData} // 数据源
                    fieldNames={{ // 自定义数据对应的结构
                        title: 'unit_name',
                        key: 'unit_id',
                        children: 'children',
                    }}
                    titleRender={nodeRender}// 自定义渲染节点 (nodeData) => ReactNode
                    onRightClick={handleRightClick} // 右键
                />
            </div>
        )
    }else{
        return (
            <div>
                loading...
            </div>
        )
    }


    // return (
    //     <div>
    //
    //         {/*/!*由于异步加载数据晚于 tree 的默认展开，会导致默认展开的设置无效。通过增加一个判断来让获取数据之后再展示 tree*!/*/}
    //         {/*{*/}
    //         {/*    // treeData.length > 0*/}
    //         {/*    //     ?*/}
    //         {/*    <Tree*/}
    //         {/*        showLine // 是否展示连接线*/}
    //         {/*        switcherIcon={<DownOutlined/>} // 展开收缩图标*/}
    //         {/*        defaultExpandedKeys={treeDataRef.current?[treeDataRef.current[0].unit_id]:[]} // 默认展开的节点，这里是默认展开根节点*/}
    //         {/*        // defaultExpandAll // 默认展开全部*/}
    //         {/*        onSelect={onSelect} // 选择事件回调*/}
    //         {/*        treeData={treeDataRef.current?treeDataRef.current:[]} // 数据源*/}
    //         {/*        fieldNames={{ // 自定义数据对应的结构*/}
    //         {/*            title: 'unit_name',*/}
    //         {/*            key: 'unit_id',*/}
    //         {/*            children: 'children',*/}
    //         {/*        }}*/}
    //         {/*        titleRender={nodeRender}// 自定义渲染节点 (nodeData) => ReactNode*/}
    //         {/*        onRightClick={handleRightClick} // 右键*/}
    //         {/*    />*/}
    //         {/*    // :*/}
    //         {/*    // <div/>*/}
    //         {/*}*/}
    //     </div>
    //
    // );
};

export default React.memo(UnitList);

