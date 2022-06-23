import React from "react";
import {Tabs} from "antd";
import SimpleSelectForm from "./SimpleSelectForm";
import AdvancedSearch from "./AdvancedSearch";
const {TabPane} = Tabs

function FunctionalZone(){
    return (
        <div
            style={{
                margin:'0 0 15px 0',
                border:'1px solid #EEEEEE',
                borderRadius:'5px',
                boxShadow:'1px 1px 1px 1px #EEEEEE',
            }}
        >
            <Tabs
                defaultActiveKey="1"
                style={{
                    padding:'0 15px 15px 15px',
                }}
            >
                <TabPane tab="简易查询" key="1">
                    <SimpleSelectForm/>
                </TabPane>
                <TabPane tab="高级搜索" key="2">
                    <AdvancedSearch/>
                </TabPane>
            </Tabs>
        </div>

    )
}

export default React.memo(FunctionalZone)
