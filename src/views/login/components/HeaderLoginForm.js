import {Col, Row} from "antd";
import React from "react";

/**
 * 登录框头部 LOGO 和文字
 * @returns {JSX.Element}
 * @constructor
 */
export default function HeaderLoginForm() {
    return (
        <>
            <Row type="flex" justify="center" align="middle">
                <Col>
                    <img
                        width={300}
                        // src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                        src={'http://8.134.73.52/public/imgs/ic_logo.png'}
                        alt=""
                        style={{
                            // 让 LOGO 视觉上居中
                            marginRight:'50px',
                            marginBottom:'30px',
                            marginTop:'30px',
                        }}
                    />
                </Col>
            </Row>
            {/*<Row type="flex" justify="center" align="middle">*/}
            {/*    <Col>*/}
            {/*        <div>广州人社局智能咨询平台</div>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
        </>
    )
}
