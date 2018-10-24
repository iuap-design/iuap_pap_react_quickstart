import React, { Component } from 'react';
import { Button,Checkbox,Table } from 'tinper-bee';
import moment from "moment/moment";
import multiSelect from "tinper-bee/lib/multiSelect.js";
import Header from 'components/Header';
import OrderInfoForm from '../OrderInfo-form';
const MultiSelectTable = multiSelect(Table, Checkbox);

export default class OrderInfoSelectTable extends Component {
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
                    title: "订单类型",
                    dataIndex: "orderType",
                    key: "orderType",
                    width: 100,
                },
                {
                    title: "编号",
                    dataIndex: "orderNo",
                    key: "orderNo",
                    width: 100,
                },
                {
                    title: "采购单位",
                    dataIndex: "purOrg",
                    key: "purOrg",
                    width: 100,
                },
                {
                    title: "发布时间",
                    dataIndex: "releaseTime",
                    key: "releaseTime",
                    width: 100,
                },
                {
                    title: "订单金额",
                    dataIndex: "orderAmount",
                    key: "orderAmount",
                    width: 100,
                },
                {
                    title: "供应商编号",
                    dataIndex: "applyNo",
                    key: "applyNo",
                    width: 100,
                },
                {
                    title: "采购组编号",
                    dataIndex: "purGroupNo",
                    key: "purGroupNo",
                    width: 100,
                },
                {
                    title: "确认时间",
                    dataIndex: "confirmTime",
                    key: "confirmTime",
                    width: 100,
                },
                {
                    title: "订单状态",
                    dataIndex: "orderState",
                    key: "orderState",
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
            <div className="OrderInfo-select-table">
                <Header title='单表orderinfo' back={true} />
                <OrderInfoForm { ...this.props }/>
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