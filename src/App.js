import IndexRouter from './router/IndexRouter';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {ConfigProvider} from "antd";

moment.locale('zh-cn');

function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <div className="App">
                <IndexRouter/>
            </div>
        </ConfigProvider>
    );
}

export default App;
