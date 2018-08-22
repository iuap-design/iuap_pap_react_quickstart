import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";

import Header from 'components/Header';
import TrainSalesorderTable from '../TrainSalesorder-table';
import TrainSalesorderForm from '../TrainSalesorder-form';

import './index.less';

/**
 * TrainSalesorderRoot Component
 */
class TrainSalesorderRoot  extends Component {
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
        actions.TrainSalesorder.loadList();
    }

    render() {
        let { pageSize, pageIndex, totalPages} = this.props;
        return (
            <div className='TrainSalesorder-root'>
                <Header title='销售订单' back={true}/>
                <TrainSalesorderForm { ...this.props }/>
                <TrainSalesorderTable { ...this.props }/>
            </div>
        )
    }
}
export default TrainSalesorderRoot;