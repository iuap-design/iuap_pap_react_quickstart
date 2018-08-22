import React, { Component } from 'react'
import { actions } from "mirrorx";
import { Table,Button } from 'tinper-bee'
import moment from "moment/moment";

import './index.less'

// TrainSalesorderTable 组件定义
class TrainSalesorderTable extends Component {
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
            childListTrainSalesorderSub:[],
            cacheArrayTrainSalesorderSub:[],
        })

        actions.routing.push(
            {
                pathname: 'TrainSalesorder-edit',
                detailObj: record,
                editFlag: !!editFlag
            }
        )
    }
    delItem = (record, index) => {
        actions.TrainSalesorder.delItem({
            param: [{ id: record.id,ts: record.ts }],
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
                    title: "销售渠道",
                    dataIndex: "distributionchannel",
                    key: "distributionchannel",
                    width: 100,
                },
                {
                    title: "订单号",
                    dataIndex: "ordernumber",
                    key: "ordernumber",
                    width: 100,
                },
                {
                    title: "客户",
                    dataIndex: "client",
                    key: "client",
                    width: 100,
                },
                {
                    title: "订单日期",
                    dataIndex: "orderdate",
                    key: "orderdate",
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

export default TrainSalesorderTable