import {Col, Row} from "antd";
import React from "react";

export default function PageFooter(){
    return(
        <Row>
            <Col span={9}>
                增值电信业务经营许可证：合字B2-20090007
            </Col>
            <Col span={6}>
                京ICP备10036305号-7
            </Col>
            <Col span={6}>
                京公网安备11010802022657号
            </Col>
            <Col span={3}>
                © 2022 Microsoft
            </Col>
        </Row>
    )
}