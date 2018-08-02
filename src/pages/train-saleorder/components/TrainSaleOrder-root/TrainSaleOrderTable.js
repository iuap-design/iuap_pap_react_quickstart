import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";

import Header from 'components/Header';
import TrainSaleOrderTable from '../TrainSaleOrder-table';
import TrainSaleOrderForm from '../TrainSaleOrder-form';

import css from './index.less';

/**
 * TrainSaleOrderRoot Component
 */
class TrainSaleOrderRoot  extends Component {
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
        actions.TrainSaleOrder.loadList();
    }

    render() {
        let { pageSize, pageIndex, totalPages} = this.props;
        return (
            <div className='TrainSaleOrder-root'>
                <Header title='TRAIN_SALE_ORDER' back={true}/>
                <TrainSaleOrderForm { ...this.props }/>
                <TrainSaleOrderTable { ...this.props }/>
            </div>
        )
    }
}
export default TrainSaleOrderRoot;