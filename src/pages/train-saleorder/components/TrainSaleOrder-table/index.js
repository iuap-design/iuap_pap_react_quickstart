import React, { Component } from 'react'
import { actions } from "mirrorx";
import { Table,Button } from 'tinper-bee'
import moment from "moment/moment";

import './index.less'

// TrainSaleOrderTable 组件定义
class TrainSaleOrderTable extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    /**
     * 编辑,详情，增加
     */
    cellClick = async(record, editFlag) => {

        // 新增、编辑、查看时,先清空子表数据
        await actions.mastertable.updateState({
            childListTrainSaleOrderSub:[],
            cacheArrayTrainSaleOrderSub:[],
        })

        actions.routing.push(
            {
                pathname: 'TrainSaleOrder-edit',
                detailObj: record,
                editFlag: !!editFlag
            }
        )
    }
    delItem = (record, index) => {
        actions.TrainSaleOrder.delItem({
            param: [{ id: record.id }],
            index: index
        });
    }
    /**
     *
     */
    render(){
        const self = this;
        const column = [
            {
                title: "序号",
                dataIndex: "index",
                key: "index",
                width: 80,
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
                            <Button size='sm' className='edit-btn' onClick={() => { self.cellClick(record, true) }}>编辑</Button>
                            <Button size='sm' className='del-btn' onClick={() => { self.delItem(record, index) }}>删除</Button>
                        </div>
                    )
                }
            }
        ];
        const { list,showLoading,pageSize, pageIndex, totalPages, } = this.props;
        return (
            <div className="table-list">
                <div className='table-header'>
                    <Button
                        size="sm"
                        colors="primary"
                        shape="border"
                        onClick={() => { self.cellClick({}, true) }}>
                        新增
                    </Button>
                </div>
                <Table
                    loading={{show:showLoading,loadingType:"line"}}
                    rowKey={(r,i)=>i}
                    columns={column}
                    data={list}
                />
            </div>
        )
    }
}

export default TrainSaleOrderTable