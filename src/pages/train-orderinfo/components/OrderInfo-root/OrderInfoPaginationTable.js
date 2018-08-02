import React, { Component } from 'react'
import PaginationTable from 'components/PaginationTable'
import {BpmButtonSubmit,BpmButtonRecall} from 'yyuap-bpm';
import { actions } from 'mirrorx';
import { Button,Message } from 'tinper-bee';
import moment from "moment/moment";
import Header from 'components/Header';
import OrderInfoForm from '../OrderInfo-form';

export default class OrderInfoPaginationTable extends Component {
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
                    render:(record, text, index) =>{
                        return index + 1;
                    }
                },
                {
                    title: "编号",

                        dataIndex: "orderNo",
                        key: "orderNo",
                    width: 200,
                },
                {
                    title: "采购单位",

                        dataIndex: "purOrgSr",
                        key: "purOrgSr",
                    width: 200,
                },
                {
                    title: "供应商编号",

                        dataIndex: "petIdSr",
                        key: "petIdSr",
                    width: 200,
                },
                {
                    title: "采购组编号",

                        dataIndex: "purGroupNo",
                        key: "purGroupNo",
                    width: 200,
                },
                {
                    title: "发布时间",

                        dataIndex: "releaseTime",
                        key: "releaseTime",
                    width: 200,
                },
                {
                    title: "确认时间",

                        dataIndex: "confirmTime",
                        key: "confirmTime",
                    width: 200,
                },
                {
                    title: "订单类型",

                        dataIndex: "orderType",
                        key: "orderType",
                    width: 200,
                },
                {
                    title: "订单状态",

                        dataIndex: "orderState",
                        key: "orderState",
                    width: 200,
                },
                {
                    title: "订单金额",

                        dataIndex: "orderAmount",
                        key: "orderAmount",
                    width: 200,
                },
                {
                    title: "是否付款",

                        dataIndex: "isPaid",
                        key: "isPaid",
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
        actions.OrderInfo.loadList();//table数据
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
        await actions.OrderInfo.updateState({
            rowData : record,
        });

        let id = "";
        // 行数据id为空表示新增页面，有值表示编辑、查看页面，btnFlag也表示是那种页面类型
        if(record){
            id = record["id"];
        }
        // 路由到编辑页,路由的配置参见src\modules\templates\router.js
        actions.routing.push(
            {
                pathname: 'OrderInfo-edit',
                search:`?search_id=${id}&btnFlag=${btnFlag}`
            }
        )
    }
    delItem = (record, index) => {
        actions.OrderInfo.delItem({
            param: [record],
            index: index
        });
    }
    onTableSelectedData = data => {
        console.log("onTableSelectedData",onTableSelectedData);
        this.setState({
            selectData: data
        })
    }
    onPageSizeSelect = (index, value) => {
        actions.OrderInfo.loadList({
            pageSize: value
        })
    }
    onPageIndexSelect = value => {
        actions.OrderInfo.loadList({
            pageIndex: value
        })
    }

    onSubmitSuc = async ()=>{
        await actions.OrderInfo.loadList();
        actions.OrderInfo.updateState({showLine:false});
        Message.create({content: '单据提交成功', color: 'success'});

    }
    // 提交操作初始执行操作
    onSubmitStart = ()=>{
        actions.OrderInfo.updateState({showLine:true});

    }
    // 提交失败回调函数
    onSubmitFail = (error)=>{
        actions.OrderInfo.updateState({showLine:false});
        Message.create({content: error.msg, color: 'danger'});

    }

    // 撤回成功，失败，开始回调函数
    onRecallSuc = async ()=>{
        console.log("onRecallSuc 成功进入recall回调");
        await actions.searchTable.loadList();
        actions.OrderInfo.updateState({showLine:false});
        Message.create({content: '单据撤回成功', color: 'success'});

    }
    onRecallFail = (error)=>{
        actions.OrderInfo.updateState({showLine:false});
        Message.create({content: error.msg, color: 'danger'});

    }
    onRecallStart = ()=>{
        actions.OrderInfo.updateState({showLine:true});
    }

    //查看方法
    onExamine = async (text, record, index)=> {
        console.log("record", record);
        await actions.OrderInfo.updateState({rowData:record});
        await actions.routing.push(
            {
                pathname: 'OrderInfo-edit',
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
        console.log(1111)
        return (
            <div className='order_info-root'>
                <Header title='订单信息' back={true} />
                <OrderInfoForm { ...this.props }/>
                <div className='table-header'>
                    <Button style={{"margin-left":15}} size='sm' shape="border" onClick={() => { self.cellClick({},0) }}>
                        新增
                    </Button>
                    <BpmButtonSubmit
                        className="ml5 "
                        checkedArray = {selectData}
                        funccode = "react"
                        nodekey = "003"
                        url = {`${GROBAL_HTTP_CTX}/order_info/submit`}
                        onSuccess = {this.onSubmitSuc}
                        onError = {this.onSubmitFail}
                        onStart={this.onSubmitStart}
                    />
                    <BpmButtonRecall
                        className="ml5 "
                        checkedArray = {selectData}
                        url = {`${GROBAL_HTTP_CTX}/order_info/recall`}
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
                    // onTableSelectedData={this.onTableSelectedData}
                    onPageSizeSelect={this.onPageSizeSelect}
                    onPageIndexSelect={this.onPageIndexSelect}
                    scroll={{ x: 1200, y: 500}}
                />
            </div>

        )

    }
}