import React, { Component } from 'react'
import PaginationTable from 'components/PaginationTable'
import {BpmButtonSubmit,BpmButtonRecall} from 'yyuap-bpm';
import { actions } from 'mirrorx';
import { Button,Message,Modal, Loading } from 'tinper-bee';
import Select from 'bee-select';
import moment from "moment/moment";
import Header from 'components/Header';
import OrderInfoForm from '../OrderInfo-form';
import AcExport from '../OrderInfo-export';
import AcUpload from 'ac-upload';
import { success, Error } from 'utils';
import 'ac-upload/build/ac-upload.css';
import './index.less'
export default class OrderInfoPaginationTable extends Component {
    constructor(props){
        super(props);
        let self=this;
        this.state = {
            // 表格中所选中的数据，拿到后可以去进行增删改查
            selectData: [],
            step: 10,
            showModal:false,
            delData:[],
            column:[
                {
                    title: "订单类型",
                    dataIndex: "orderType",
                    key: "orderType",
                     width:200,
                    render : (text, record, index) => (
                        <Select
                            className = "hideselect"
                            disabled = {true}
                            value={ text || '' }
                        >
                            <Option value="">请选择</Option>
                                <Option value="0">生产订单</Option>
                                <Option value="1">日常订单</Option>
                                <Option value="2">临时订单</Option>
                                <Option value="3">测试订单</Option>
                        </Select>
                    )
                },
                {
                    title: "编号",
                    dataIndex: "orderNo",
                    key: "orderNo",
                     width:200,
                },
                {
                    title: "发布时间",
                    dataIndex: "releaseTime",
                    key: "releaseTime",
                     width:200,
                },
                {
                    title: "订单金额",
                    dataIndex: "orderAmount",
                    key: "orderAmount",
                     width:200,
                },
                {
                    title: "采购组编号",
                    dataIndex: "purGroupNo",
                    key: "purGroupNo",
                     width:200,
                },
                {
                    title: "确认时间",
                    dataIndex: "confirmTime",
                    key: "confirmTime",
                     width:200,
                },
                {
                    title: "订单流程状态",
                    dataIndex: "bpmState",
                    key: "bpmState",
                    width:200,
                    render : (text, record, index) => (
                        <Select
                            className = "hideselect"
                            disabled = {true}
                            value={ typeof text === 'number' ? `${text}` : '0' }
                        >
                            <Option value="">请选择</Option>
                            <Option value="0">待确认</Option>
                            <Option value="1">执行中</Option>
                            <Option value="2">已办结</Option>
                            <Option value="3">终止</Option>
                        </Select>
                    )
                },
                {
                    title: "订单状态",
                    dataIndex: "orderState",
                    key: "orderState",
                    width:200,
                    render : (text, record, index) => (
                        <Select
                            className = "hideselect"
                            disabled = {true}
                            value={ typeof text === 'number' ? `${text}` : '0' }
                        >
                            <Option value="0">交货</Option>
                            <Option value="1">合同</Option>
                            <Option value="2">意向</Option>
                        </Select>
                    )
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
        if(record){
            id = record["id"];
        }
        actions.routing.push(
            {
                pathname: 'OrderInfo-edit',
                search:`?search_id=${id}&btnFlag=${btnFlag}`
            }
        )
    }

    // 删除操作
    delItem = (record, index) => {
        this.setState({
            showModal:true,
            delData:[{ id: record.id,ts: record.ts }]
        });

    }

    // 表格勾选回调函数，返回选中数据
    onTableSelectedData = data => {

        this.setState({
            selectData: data
        })
    }

    // 分页单页数据条数选择函数
    onPageSizeSelect = (index, value) => {
        actions.OrderInfo.loadList({
            pageSize: value
        })
        actions.OrderInfo.updateState({
            pageSize: value
        })
    }

    // 分页组件点击页面数字索引执行函数
    onPageIndexSelect = value => {
        actions.OrderInfo.loadList({
            pageIndex: value
        })
        actions.OrderInfo.updateState({
            pageIndex: value
        })
    }

    // 流程提交成功后回调函数
    onSubmitSuc = async ()=>{
        await actions.OrderInfo.loadList();
        actions.OrderInfo.updateState({showLoading:false});
        Message.create({content: '单据提交成功', color: 'success'});

    }

    // 提交操作初始执行操作
    onSubmitStart = ()=>{
        actions.OrderInfo.updateState({showLoading:true});

    }
    // 提交失败回调函数
    onSubmitFail = (error)=>{
        actions.OrderInfo.updateState({showLoading:false});
        Message.create({content: error.msg, color: 'danger'});

    }

    onSubmitEnd = () => {
        actions.OrderInfo.updateState({ showLoading: false });
    }

    // 撤回成功回调函数
    onRecallSuc = async ()=>{
        console.log("onRecallSuc 成功进入recall回调");
        await actions.OrderInfo.loadList();
        actions.OrderInfo.updateState({showLoading:false});
        Message.create({content: '单据撤回成功', color: 'success'});

    }

    // 撤回失败回调函数
    onRecallFail = (error)=>{
        actions.OrderInfo.updateState({showLoading:false});
        Message.create({content: error.msg, color: 'danger'});

    }

    // 撤回操作执行起始函数,通常用于设置滚动条
    onRecallStart = ()=>{
        actions.OrderInfo.updateState({showLoading:true});
    }

    // 查看方法
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

    // 模态框确认删除
    onModalDel = async (delFlag)=>{
        let {delData} = this.state;
        if(delFlag){
            await actions.OrderInfo.delItem({
                param: delData
            });
        }
        this.setState({
            showModal:false,
            delData:[]
        })
    }
    // 模板下载
    onLoadTemplate = () => {
        window.open(`${GROBAL_HTTP_CTX}/order_info/excelTemplateDownload`)
    }

    // 导入回调
    handlerUploadSuccess = (data)=>{
        console.log("data", data);
        if (data.status && data.status === "success") {
            // 导入成功后，列表加载数据
            success('导入数据成功');
            actions.OrderInfo.loadList();
        } else {
            // 导入失败后
            Error(`${data.msg ? data.msg : '导入失败'}`);
        } 
    }

    // 导入删除回调函数
    handlerUploadDelete = (file) => {

    }


    // 打印数据
    printExcel = ()=>{
        if(!this.state.selectData.length)
        {
            Message.create({ content: '请选择需打印的数据', color : 'danger'  });
            return;
        }
        actions.OrderInfo.printExcel({
            queryParams:
            {
                funccode: 'OrderInfo',
                nodekey: '002'
            },
            printParams:
            {
                id:this.state.selectData[0].id
            }
        });
    }

    // 动态设置列表滚动条x坐标
    getCloumnsScroll = (columns) => {
        let sum = 0;
        columns.forEach((da) => {
            sum += da.width;
        })
        return (sum);
    }

    render(){
        const self=this;
        let { list, showLoading, pageIndex, pageSize, totalPages , total } = this.props;
        let {selectData,showModal} = this.state;
        let exportProps = { total, pageIndex, pageSize, selectData, list};
        console.log("list",list)
        return (
            <div className='OrderInfo-root'>
                <Header title='单表orderinfo'/>
                <OrderInfoForm { ...this.props }/>
                <div className='table-header mt25'>
                    <Button colors="primary" style={{"marginLeft":15}} size='sm' onClick={() => { self.cellClick({},0) }}>
                    新增
                    </Button>
                    <BpmButtonSubmit
                            className="ml5 "
                            checkedArray = {selectData}
                            funccode = "OrderInfo"
                            nodekey = "003"
                            url = {`${GROBAL_HTTP_CTX}/order_info/submit`}
                            urlAssignSubmit={`${GROBAL_HTTP_CTX}/order_info/assignSubmit`}
                            onSuccess = {this.onSubmitSuc}
                            onError = {this.onSubmitFail}
                            onStart={this.onSubmitStart}
                            onEnd={this.onSubmitEnd}
                    >
                        <Button size='sm' style={{"marginLeft":"15px"}} className="admin"  colors="primary">提交</Button>
                    </BpmButtonSubmit>
                    <BpmButtonRecall
                            className="ml5 "
                            checkedArray = {selectData}
                            url = {`${GROBAL_HTTP_CTX}/order_info/recall`}
                            onSuccess = {this.onRecallSuc}
                            onError = {this.onRecallFail}
                            onStart = {this.onRecallStart}
                            onEnd={this.onSubmitEnd}
                    >
                        <Button size='sm' style={{"marginLeft":"15px"}} className="admin"  colors="primary">收回</Button>
                    </BpmButtonRecall>

                    <Button colors="primary" className="ml5" size='sm' onClick={() => { self.printExcel() }}>
                        打印
                    </Button>

                    <Button colors="primary" className="ml5" size='sm' onClick={ self.onLoadTemplate}>模板下载</Button>
                    <AcUpload
                        title={"导入"}
                        action={`${GROBAL_HTTP_CTX}/order_info/toImportExcel`}
                        multiple={false}
                        onError={() => console.log('上传报错了')}
                        onSuccess={self.handlerUploadSuccess}
                        onDelete={ self.handlerUploadDelete}
                    >
                        <Button className="ml5" colors="primary" size='sm'>导入</Button>
                    </AcUpload>
                    <AcExport {...exportProps} className="ml5"/>
                </div>
                <PaginationTable
                        data={list}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalPages={totalPages}
                        total = {total}
                        columns={this.state.column}
                        checkMinSize={6}
                        getSelectedDataFunc={this.tabelSelect}
                        onTableSelectedData={this.onTableSelectedData}
                        onPageSizeSelect={this.onPageSizeSelect}
                        onPageIndexSelect={this.onPageIndexSelect}
                />
                <Loading container={self.getElement} show={showLoading} loadingType="line" />
                <Modal
                        show={showModal}
                        onHide={this.close} >
                    <Modal.Header>
                        <Modal.Title>确认删除</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        是否删除选中内容
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={()=>this.onModalDel(false)} shape="border" style={{ marginRight: 50 }}>关闭</Button>
                        <Button onClick={()=>this.onModalDel(true)} colors="primary">确认</Button>
                    </Modal.Footer>
                </Modal>
            </div>

        )

    }
}