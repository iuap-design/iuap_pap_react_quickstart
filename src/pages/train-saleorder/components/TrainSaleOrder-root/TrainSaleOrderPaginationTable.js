import React, { Component } from 'react'
import PaginationTable from 'components/PaginationTable'
import {BpmButtonSubmit,BpmButtonRecall} from 'yyuap-bpm';
import { actions } from 'mirrorx';
import { Button,Message } from 'tinper-bee';
import moment from "moment/moment";
import Header from 'components/Header';
import TrainSaleOrderForm from '../TrainSaleOrder-form';

export default class TrainSaleOrderPaginationTable extends Component {
    constructor(props){
        super(props);
        let self=this;
        this.state = {
            // 表格中所选中的数据，拿到后可以去进行增删改查
            selectData: [],
            step: 10,
            column:[
                {
                    title: "序号",
                    dataIndex: "index",
                    key: "index",
                    width: 200,
                    render(record, text, index) {
                        return index + 1;
                    }
                },
                {
                    title: "组织",

                    dataIndex: "organizationStr",
                    key: "organizationStr",
                    width: 200,
                },
                {
                    title: "订单号",

                        dataIndex: "orderNumber",
                        key: "orderNumber",
                    width: 200,
                },
                {
                    title: "订单日期",

                        dataIndex: "orderDate",
                        key: "orderDate",
                    width: 200,
                },
                {
                    title: "销售渠道",

                        dataIndex: "distributionChannel",
                        key: "distributionChannel",
                    width: 200,
                },
                {
                    title: "交货日期",

                        dataIndex: "deliveryDate",
                        key: "deliveryDate",
                    width: 200,
                },
                {
                    title: "客户",

                        dataIndex: "client",
                        key: "client",
                    width: 200,
                },
                {
                    title: "订单金额",

                        dataIndex: "orderAmount",
                        key: "orderAmount",
                    width: 200,
                },
                {
                    title: "经办业务员",

                        dataIndex: "salesmanName",
                        key: "salesmanName",
                    width: 200,
                },
                {
                    title: "备注",

                        dataIndex: "remark",
                        key: "remark",
                    width: 200,
                },
                {
                    title: "操作",
                    dataIndex: "d",
                    key: "d",
                    width:100,
                    fixed: "right",
                    render(text, record, index) {
                        return (
                            <div className='operation-btn'>
                                <i size='sm' className='uf uf-search edit-btn' onClick={() => { self.cellClick(record,2) }}></i>
                                <i size='sm' className='uf uf-pencil edit-btn' onClick={() => { self.cellClick(record,1) }}></i>
                                <i size='sm' className='uf uf-del del-btn' onClick={() => { self.delItem(record, index) }}></i>
                            </div>
                        )
                    }
                }
            ]
        }
    }
    componentDidMount(){
        // this.setState({ step: this.props.pageSize })
        actions.TrainSaleOrder.loadList();//table数据
    }
    tabelSelect = (data) => {//tabel选中数据
        this.setState({
            selectData: data
        })
    }
    /**
     * 编辑,详情，增加
     */

    cellClick = async (record,btnFlag) => {
        var {match} = this.props;
        await actions.TrainSaleOrder.updateState({
            rowData : record,
        });

        let id = "";
        if(record){
            id = record["id"];
        }
        actions.routing.push(
            {
                pathname: `${match.url}TrainSaleOrder-edit`,
                search:`?search_id=${id}&btnFlag=${btnFlag}`
            }
        )
    }
    delItem = (record, index) => {
        actions.TrainSaleOrder.delItem({
            param: [record],
            index: index
        });
    }
    onTableSelectedData = data => {

        this.setState({
            selectData: data
        })
    }
    onPageSizeSelect = (index, value) => {
        actions.TrainSaleOrder.loadList({
            pageSize: value
        })
    }
    onPageIndexSelect = value => {
        actions.TrainSaleOrder.loadList({
            pageIndex: value
        })
    }

    onSubmitSuc = async ()=>{
        await actions.TrainSaleOrder.loadList();
        actions.TrainSaleOrder.updateState({showLine:false});
        Message.create({content: '单据提交成功', color: 'success'});

    }
    // 提交操作初始执行操作
    onSubmitStart = ()=>{
        actions.TrainSaleOrder.updateState({showLine:true});

    }
    // 提交失败回调函数
    onSubmitFail = (error)=>{
        actions.TrainSaleOrder.updateState({showLine:false});
        Message.create({content: error.msg, color: 'danger'});

    }

    // 撤回成功，失败，开始回调函数
    onRecallSuc = async ()=>{
        console.log("onRecallSuc 成功进入recall回调");
        await actions.searchTable.loadList();
        actions.TrainSaleOrder.updateState({showLine:false});
        Message.create({content: '单据撤回成功', color: 'success'});

    }
    onRecallFail = (error)=>{
        actions.TrainSaleOrder.updateState({showLine:false});
        Message.create({content: error.msg, color: 'danger'});

    }
    onRecallStart = ()=>{
        actions.TrainSaleOrder.updateState({showLine:true});
    }

    //查看方法
    onExamine = async (text, record, index)=> {
        console.log("record", record);
        await actions.TrainSaleOrder.updateState({rowData:record});
        await actions.routing.push(
            {
                pathname: 'TrainSaleOrder-edit',
                detailObj: record,
            }
        )
    }

    // 清空selectData
    clearSelData = ()=>{
        this.setState({
            selectData:[]
        })
    }

    render(){
        const self=this;
        let { list, showLoading, pageIndex, pageSize, totalPages } = this.props;
        let {selectData} = this.state;
        console.log("list",list)
        return (
            <div className='TRAIN_SALE_ORDER-root'>
                <Header title='TRAIN_SALE_ORDER' back={true} />
                <TrainSaleOrderForm { ...this.props }/>
                <div className='table-header'>
                    <Button style={{"margin-left":15}} size='sm' shape="border" onClick={() => { self.cellClick({},0) }}>
                        新增
                    </Button>
                    <BpmButtonSubmit
                        className="ml5 "
                        checkedArray = {selectData}
                        funccode = "react"
                        nodekey = "003"
                        url = {`${GROBAL_HTTP_CTX}/TRAIN_SALE_ORDER/submit`}
                        onSuccess = {this.onSubmitSuc}
                        onError = {this.onSubmitFail}
                        onStart={this.onSubmitStart}
                    />
                    <BpmButtonRecall
                        className="ml5 "
                        checkedArray = {selectData}
                        url = {`${GROBAL_HTTP_CTX}/TRAIN_SALE_ORDER/recall`}
                        onSuccess = {this.onRecallSuc}
                        onError = {this.onRecallFail}
                        onStart = {this.onRecallStart}
                    />
                </div>
                <PaginationTable
                    data={list}
                    showLoading={showLoading}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    columns={this.state.column}
                    checkMinSize={6}
                    getSelectedDataFunc={this.tabelSelect}
                    onTableSelectedData={this.onTableSelectedData}
                    onPageSizeSelect={this.onPageSizeSelect}
                    onPageIndexSelect={this.onPageIndexSelect}
                    scroll={{ x: 1200, y: 500}}
                />
            </div>

        )

    }
}