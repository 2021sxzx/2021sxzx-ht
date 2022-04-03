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
                            width={200}
                            src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                            alt=""
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col>
                        <div>广州人社局智能咨询平台</div>
                    </Col>
                </Row>
            </>
    )
}