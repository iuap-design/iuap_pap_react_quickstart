import React, { Component } from 'react'
import { actions } from "mirrorx";
import { Table,Button } from 'tinper-bee'
import moment from "moment/moment";

import './index.less'

// OrderInfoTable 组件定义
class OrderInfoTable extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    /**
     * 编辑,详情，增加
     */
    cellClick = async(record, editFlag) => {
        const {match} = this.props;

        actions.routing.push(
            {
                pathname: `${match.url}OrderInfo-edit`,
                detailObj: record,
                editFlag: !!editFlag
            }
        )
    }
    delItem = (record, index) => {
        actions.OrderInfo.delItem({
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
                title: "发布时间",
                dataIndex: "releaseTime",
                key: "releaseTime",
                width: 100,
            },
            {
                title: "确认时间",
                dataIndex: "confirmTime",
                key: "confirmTime",
                width: 100,
            },
            {
                title: "订单类型",
                dataIndex: "orderType",
                key: "orderType",
                width: 100,
            },
            {
                title: "订单状态",
                dataIndex: "orderState",
                key: "orderState",
                width: 100,
            },
            {
                title: "订单金额",
                dataIndex: "orderAmount",
                key: "orderAmount",
                width: 100,
            },
            {
                title: "是否付款",
                dataIndex: "isPaid",
                key: "isPaid",
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

export default OrderInfoTable