import React, { Component } from 'react';
import { Button,Checkbox,Table } from 'tinper-bee';
import moment from "moment/moment";
import multiSelect from "tinper-bee/lib/multiSelect.js";
import Header from 'components/Header';
import TrainSaleOrderForm from '../TrainSaleOrder-form';
const MultiSelectTable = multiSelect(Table, Checkbox);

export default class TrainSaleOrderSelectTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectData:[]
        }
    }
    /**
     * 编辑
     */
    edit = () =>{
        console.log('进入编辑');
    }
    /**
     * tabel选中数据
     * @param {*} data
     */
    tabelSelect = (data) => {
        this.setState({
            selectData: data
        })
    }
    render(){
        const self=this;
        const { list,showLoading,pageSize, pageIndex, totalPages } = this.props;
        const column = [
            {
                title: "序号",
                dataIndex: "index",
                key: "index",
                width: 100,
                render(record, text, index) {
                    return index + 1;
                }
            },
            {
                title: "ORGANIZATION",
                dataIndex: "organization",
                key: "organization",
                width: 100,
            },
            {
                title: "ORDERNUMBER",
                dataIndex: "orderNumber",
                key: "orderNumber",
                width: 100,
            },
            {
                title: "ORDERDATE",
                dataIndex: "orderDate",
                key: "orderDate",
                width: 100,
            },
            {
                title: "DISTRIBUTIONCHANNEL",
                dataIndex: "distributionChannel",
                key: "distributionChannel",
                width: 100,
            },
            {
                title: "DELIVERYDATE",
                dataIndex: "deliveryDate",
                key: "deliveryDate",
                width: 100,
            },
            {
                title: "CLIENT",
                dataIndex: "client",
                key: "client",
                width: 100,
            },
            {
                title: "ORDERAMOUNT",
                dataIndex: "orderAmount",
                key: "orderAmount",
                width: 100,
            },
            {
                title: "SALESMAN",
                dataIndex: "salesman",
                key: "salesman",
                width: 100,
            },
            {
                title: "REMARK",
                dataIndex: "remark",
                key: "remark",
                width: 100,
            },
            {
                title: "操作",
                dataIndex: "e",
                key: "e",
                render(text, record, index) {
                    return (
                        <div className='operation-btn'>
                            <Button size='sm' className='edit-btn' onClick={() => { self.edit(record,true) }}>编辑</Button>
                        </div>
                    )
                }
            }
        ];
        return (
            <div className="TrainSaleOrder-select-table">
                <Header title='TRAIN_SALE_ORDER' back={true} />
                <TrainSaleOrderForm { ...this.props }/>
                <div className="table-list">
                    <MultiSelectTable
                        loading={{ show: showLoading, loadingType: "line" }}
                        rowKey={(r, i) => i}
                        columns={column}
                        data={list}
                        multiSelect={{ type: "checkbox" }}
                        getSelectedDataFunc={this.tabelSelect}
                    />
                </div>
            </div>
        )
    }
}