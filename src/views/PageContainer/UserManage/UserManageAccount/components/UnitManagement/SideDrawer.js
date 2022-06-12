import React, {useState} from 'react';
import {Drawer, Popover} from 'antd';
import {DoubleLeftOutlined, DoubleRightOutlined} from "@ant-design/icons";

/**
 * 抽屉组件
 * API 参考：https://ant.design/components/drawer-cn/#components-drawer-demo-render-in-current
 *
 * @param props
 * {
 *     children:*, // 被包裹的子组件, 例如 <SideDrawer><p>hello world</p></SideDrawer>
 *     buttonTitle:string, // 按钮标题
 *     title:string, // 标题，默认‘标题’
 *     placement:'top' | 'right' | 'bottom' | 'left', // 出现位置，默认 'left'
 *     visible:boolean, // 初始是否可见，默认 true
 *     getContainer:HTMLElement | () => HTMLElement | Selectors | false, // 挂载到哪个元素上，false 为当前元素，body 为根节点上
 *     style:CSSProperties, // 可用于设置 Drawer 容器的样式，默认 {position: 'fixed'}
 *     drawerContainerOpenStyle:CSSProperties, // Drawer 外层容器的样式
 *     extra:reactNode, // 自定义右上角操作区
 * }
 * @return {JSX.Element}
 * @constructor
 */
const SideDrawer = (props) => {
    console.log('SideDrawer')
    const [visible, setVisible] = useState(typeof !(props.visible) === 'boolean' ? !!(props.visible) : true);

    const switchDrawer = () => {
        setVisible(!visible);
    };

    const onClose = () => {
        setVisible(false);
    };

    return (
        <div>
            {
                visible === false
                    ?
                    <div style={{
                        height: '100%',
                    }}>
                        {/*打开抽屉按钮*/}
                        <Popover
                            content={props.buttonTitle ? props.buttonTitle : 'Switch'}
                            // title={props.buttonTitle ? props.buttonTitle : 'Switch'}
                            trigger="hover"
                            placement="rightTop"
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    width: '30px',
                                    background: '#EEEEEE',
                                }}
                                onClick={switchDrawer}
                            >
                                {/*图标*/}
                                <DoubleRightOutlined/>
                            </div>
                        </Popover>
                    </div>
                    :
                    <div style={props.drawerContainerOpenStyle ? props.drawerContainerOpenStyle : {height: '100%'}}>
                        {/*打开的抽屉*/}
                        <Drawer
                            title={props.title ? props.title : '标题'}// 标题
                            placement={props.placement ? props.placement : "left"} // 出现的方向
                            onClose={onClose} // 关闭事件的回调函数
                            closable={true} // 是否可关闭
                            closeIcon={<DoubleLeftOutlined/>} // 关闭按钮图标
                            visible={visible} // 是否可见
                            mask={false} // 是否设置遮罩层
                            getContainer={props.getContainer ? props.getContainer : false} // 获取抽屉定位
                            style={props.style ? props.style : {position: 'fixed'}} // 设置抽屉样式
                            extra={props.extra ? props.extra : <div/>}
                        >
                            {props.children ? props.children : 'Nothing'}
                        </Drawer>
                    </div>
            }
        </div>
    );
};

export default React.memo(SideDrawer);
