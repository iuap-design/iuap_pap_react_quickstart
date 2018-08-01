import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";

import Header from 'components/Header';
import OrderInfoTable from '../OrderInfo-table';
import OrderInfoForm from '../OrderInfo-form';

import './index.less';

/**
 * OrderInfoRoot Component
 */
class OrderInfoRoot  extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }
    /**
     *
     */
    componentWillMount() {
        this.getTableData();
    }
    /**
     * 获取table表格数据
     */
    getTableData = () => {
        actions.OrderInfo.loadList();
    }

    render() {
        let { pageSize, pageIndex, totalPages} = this.props;
        return (
            <div className='OrderInfo-root'>
                <Header title='订单信息' back={true}/>
                <OrderInfoForm { ...this.props }/>
                <OrderInfoTable { ...this.props }/>
            </div>
        )
    }
}
export default OrderInfoRoot;