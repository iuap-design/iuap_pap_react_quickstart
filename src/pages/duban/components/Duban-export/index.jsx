import React, { Component } from 'react';
import { actions } from 'mirrorx';
import { Dropdown, Menu, Button, Message } from 'tinper-bee';
import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl';
import Select from 'bee-select';

// 工具函数
import { success, Error } from 'utils';

import './index.less'

const { Item } = Menu;

class AcExport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selIndex: "0",
        };

    }

    // 下拉选择函数
    onSelect = ({ key }) => {
        console.log("key",key);
        this.setState({
            selIndex : key
        })

        this.exportExcel(key);
    }

    exportExcel = (selIndex) => {
        let  { pageIndex, pageSize, total, selectData, list } = this.props;
        if ( selIndex == '0' ) {

            // 导出选中数据
            // this.exportSelData(selectData);
            if(!this.isEmpty(selectData)) {
                actions.Duban.exportExcel({
                    dataList : selectData
                });
            }

        } else if ( selIndex == '1' ) {
            if(!this.isEmpty(list)) {
                // 导出当前页
                window.open(`${GROBAL_HTTP_CTX}/DUBAN/toExportExcelAll?1=1&pageIndex=${pageIndex-1}&pageSize=${pageSize}`)
            }

        } else {

            if(!this.isEmpty(total)) {
                // 导出全部,将设置的页面数据条数设置为总数据条数
                window.open(`${GROBAL_HTTP_CTX}/DUBAN/toExportExcelAll?1=1&pageIndex=0&pageSize=${total}`)
            }

        }

    }

    isEmpty = (data) => {
        if ( !data || (data && data.length === 0) ) {
            Error('导出数据为空');
            return true;
        }

        return false;
    }

    render() {
        let self = this;
        let { className } = self.props;
        console.log("export props",self.props)
        const menu1 = (
            <Menu
                selectedKeys = {[]}
                onSelect={self.onSelect}>
                <Item key="0">导出选中数据</Item>
                <Item key="1">导出当前页</Item>
                <Item key="2">导出全部数据</Item>
            </Menu>
        );
        return (
            <div className="AcExport">
                <Dropdown
                   trigger={['click']}
                   overlay={menu1}
                   animation="slide-up"
                 >
                    <Button colors="primary" className={className} size='sm' >
                        <FormattedMessage
                            id="intl.button.export"
                        />
                    </Button>
                 </Dropdown>

            </div>
        );
    }
}

export default AcExport;