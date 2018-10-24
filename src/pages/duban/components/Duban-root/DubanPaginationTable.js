import React, { Component } from 'react'
import PaginationTable from 'components/PaginationTable'
import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl';
import {BpmButtonSubmit,BpmButtonRecall} from 'yyuap-bpm';
import { actions } from 'mirrorx';
import { Button,Message,Modal, Loading } from 'tinper-bee';
import Select from 'bee-select';
import moment from "moment/moment";
import Header from 'components/Header';
import DubanForm from '../Duban-form';
import AcExport from '../Duban-export';
import AcUpload from 'ac-upload';
import { success, Error } from 'utils';
import 'ac-upload/build/ac-upload.css';
import './index.less'


export default class DubanPaginationTable extends Component {
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
                    title: <FormattedMessage
                        id="intl.table.number"
                    />,
                    dataIndex: "code",
                    key: "code",
                     width:200,
                },
                {
                    title: <FormattedMessage
                        id="intl.table.endTime"
                    />,
                    dataIndex: "endDate",
                    key: "endDate",
                     width:200,
                },
                {
                    title: <FormattedMessage
                    id="intl.table.liable"
                    />,
                    dataIndex: "zrrName",
                    key: "zrrName",
                     width:200,
                },
                {
                    title: <FormattedMessage
                        id="intl.table.taskScore"
                    />,
                    dataIndex: "rwpf",
                    key: "rwpf",
                     width:200,
                },
                {
                    title: <FormattedMessage
                        id="intl.table.source"
                    />,
                    dataIndex: "lyCode",
                    key: "lyCode",
                     width:200,
                    render : (text, record, index) => (
                        <Select
                            className = "hideselect"
                            disabled = {true}
                            value={ text || '' }
                        >
                            <Option value=""><FormattedMessage
                                id="intl.table.source.option"
                            /></Option>
                                <Option value="1"><FormattedMessage
                                    id="intl.table.source.leadOffice"
                                /></Option>
                                <Option value="2"><FormattedMessage
                                    id="intl.table.source.meetingSummary"
                                /></Option>
                                <Option value="3"><FormattedMessage
                                    id="intl.table.source.other"
                                /></Option>
                        </Select>
                    )
                },
                {
                    title: <FormattedMessage
                        id="intl.table.orderStatus"
                    />,
                    dataIndex: "bpmState",
                    key: "bpmState",
                     width:200,
                    render : (text, record, index) => (
                        <Select
                            className = "hideselect"
                            disabled = {true}
                            value={ typeof text === 'number' ? `${text}` : '0' }
                        >
                            <Option value=""><FormattedMessage
                                id="intl.table.orderStatus.option"
                            /></Option>
                            <Option value="0"><FormattedMessage
                                id="intl.table.orderStatus.confirm"
                            /></Option>
                            <Option value="1"><FormattedMessage
                                id="intl.table.orderStatus.executing"
                            /></Option>
                            <Option value="2"><FormattedMessage
                                id="intl.table.orderStatus.done"
                            /></Option>
                            <Option value="3"><FormattedMessage
                                id="intl.table.orderStatus.end"
                            /></Option>
                        </Select>
                    )
                },
                {
                    title: <FormattedMessage
                        id="intl.table.leadLeader"
                    />,
                    dataIndex: "qtLd",
                    key: "qtLd",
                     width:200,
                },
                {
                    title: <FormattedMessage
                        id="intl.table.progressRatio"
                    />,
                    dataIndex: "jdBl",
                    key: "jdBl",
                     width:200,
                },
                {
                    title: <FormattedMessage
                        id="intl.table.responsibilityUnit"
                    />,
                    dataIndex: "zrdwName",
                    key: "zrdwName",
                     width:200,
                },
                {
                    title: <FormattedMessage
                        id="intl.table.state"
                    />,
                    dataIndex: "state",
                    key: "state",
                     width:200,
                    render : (text, record, index) => (
                        <Select
                            className = "hideselect"
                            disabled = {true}
                            value={ text || '' }
                        >
                            <Option value="">请选择</Option>
                                <Option value="0">未执行</Option>
                                <Option value="1">已执行</Option>
                        </Select>
                    )
                },
                {
                    title: <FormattedMessage
                        id="intl.table.supervisionMatters"
                    />,
                    dataIndex: "dbInfo",
                    key: "dbInfo",
                     width:200,
                },
                {
                    title: <FormattedMessage
                        id="intl.table.coordinator"
                    />,
                    dataIndex: "xbrName",
                    key: "xbrName",
                     width:200,
                },
                {
                    title: <FormattedMessage
                        id="intl.table.cooperatingunit"
                    />,
                    dataIndex: "xbDwName",
                    key: "xbDwName",
                     width:200,
                },
                {
                    title: <FormattedMessage
                        id="intl.table.kpiLevel"
                    />,
                    dataIndex: "kpiLevel",
                    key: "kpiLevel",
                     width:200,
                    render : (text, record, index) => (
                        <Select
                            className = "hideselect"
                            disabled = {true}
                            value={ text || '' }
                        >
                            <Option value="">请选择</Option>
                                <Option value="1">一级</Option>
                                <Option value="2">二级</Option>
                        </Select>
                    )
                },
                {
                    title: <FormattedMessage
                        id="intl.table.delivery"
                    />,
                    dataIndex: "jfyq",
                    key: "jfyq",
                     width:200,
                },
                {
                    title: <FormattedMessage
                        id="intl.table.sponsor"
                    />,
                    dataIndex: "zbrName",
                    key: "zbrName",
                     width:200,
                },
                {
                    title: <FormattedMessage
                        id="intl.table.startTime"
                    />,
                    dataIndex: "beginDate",
                    key: "beginDate",
                     width:200,
                },
                {
                    title: <FormattedMessage
                        id="intl.table.isKpi"
                    />,
                    dataIndex: "kpiFlag",
                    key: "kpiFlag",
                     width:200,
                    render : (text, record, index) => (
                        <Select
                            className = "hideselect"
                            disabled = {true}
                            value={ text || '' }
                        >
                            <Option value="">请选择</Option>
                                <Option value="1">是</Option>
                                <Option value="0">否</Option>
                        </Select>
                    )
                },
                {
                    title: <FormattedMessage
                        id="intl.table.affiliatedOrganization"
                    />,
                    dataIndex: "unitIdName",
                    key: "unitIdName",
                     width:200,
                },
                {
                    title: <FormattedMessage
                        id="intl.table.remarks"
                    />,
                    dataIndex: "lySm",
                    key: "lySm",
                     width:200,
                },
                {
                    title: <FormattedMessage
                        id="intl.table.supervisor"
                    />,
                    dataIndex: "dbr",
                    key: "dbr",
                     width:200,
                },
                {
                    title: <FormattedMessage
                        id="intl.table.supervisionName"
                    />,
                    dataIndex: "name",
                    key: "name",
                     width:200,
                },
                {
                    title: <FormattedMessage
                        id="intl.table.importance"
                    />,
                    dataIndex: "zyCd",
                    key: "zyCd",
                    width:200,
                    render : (text, record, index) => (
                        <Select
                            className = "hideselect"
                            disabled = {true}
                            value={ text || '' }
                        >
                            <Option value="">请选择</Option>
                                <Option value="1">重要</Option>
                                <Option value="0">一般</Option>
                        </Select>
                    )
                },
                {
                    title: <FormattedMessage
                        id="intl.table.operation"
                    />,
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
        actions.Duban.loadList();//table数据
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
        await actions.Duban.updateState({
            rowData : record,
        });

        let id = "";
        if(record){
            id = record["id"];
        }
        actions.routing.push(
            {
                pathname: 'Duban-edit',
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
        actions.Duban.loadList({
            pageSize: value
        })
        actions.Duban.updateState({
            pageSize: value
        })
    }

    // 分页组件点击页面数字索引执行函数
    onPageIndexSelect = value => {
        actions.Duban.loadList({
            pageIndex: value
        })
        actions.Duban.updateState({
            pageIndex: value
        })
    }

    // 流程提交成功后回调函数
    onSubmitSuc = async ()=>{
        await actions.Duban.loadList();
        actions.Duban.updateState({showLoading:false});
        Message.create({content: '单据提交成功', color: 'success'});

    }

    // 提交操作初始执行操作
    onSubmitStart = ()=>{
        actions.Duban.updateState({showLoading:true});

    }
    // 提交失败回调函数
    onSubmitFail = (error)=>{
        actions.Duban.updateState({showLoading:false});
        Message.create({content: error.msg, color: 'danger'});

    }

    // 撤回成功回调函数
    onRecallSuc = async ()=>{
        console.log("onRecallSuc 成功进入recall回调");
        await actions.Duban.loadList();
        actions.Duban.updateState({showLoading:false});
        Message.create({content: '单据撤回成功', color: 'success'});

    }

    // 撤回失败回调函数
    onRecallFail = (error)=>{
        actions.Duban.updateState({showLoading:false});
        Message.create({content: error.msg, color: 'danger'});

    }


    onSubmitEnd = () => {
        actions.Duban.updateState({ showLoading: false });
    }

    // 撤回操作执行起始函数,通常用于设置滚动条
    onRecallStart = ()=>{
        actions.Duban.updateState({showLoading:true});
    }

    // 查看方法
    onExamine = async (text, record, index)=> {
        console.log("record", record);
        await actions.Duban.updateState({rowData:record});
        await actions.routing.push(
            {
                pathname: 'Duban-edit',
                detailObj: record,
            }
        )
    }

    // 模态框确认删除
    onModalDel = async (delFlag)=>{
        let {delData} = this.state;
        if(delFlag){
            await actions.Duban.delItem({
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
        window.open(`${GROBAL_HTTP_CTX}/DUBAN/excelTemplateDownload`)
    }

    // 导入回调
    handlerUploadSuccess = (data)=>{
        console.log("data", data);
        if (data.status && data.status === "success") {
            // 导入成功后，列表加载数据
            success('导入数据成功');
            actions.Duban.loadList();
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
        actions.Duban.printExcel({
            queryParams:
            {
                funccode: 'Duban',
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
        let exportProps = {total,pageIndex,pageSize,selectData, list };
        //console.log("list",list)

        return (
            <div className='Duban-root'>

                <Header title={<FormattedMessage
                    id="intl.title"
                />} />
                <DubanForm { ...this.props }/>
                <div className='table-header mt25'>
                    <Button colors="primary" style={{"marginLeft":15}} size='sm' onClick={() => { self.cellClick({},0) }}>
                        <FormattedMessage
                        id="intl.button.create"
                    />
                    </Button>
                    <BpmButtonSubmit
                            className="ml5 "
                            checkedArray = {selectData}
                            funccode = "Duban"
                            nodekey = "003"
                            url = {`${GROBAL_HTTP_CTX}/DUBAN/submit`}
                            urlAssignSubmit={`${GROBAL_HTTP_CTX}/DUBAN/assignSubmit`}
                            onSuccess = {this.onSubmitSuc}
                            onError = {this.onSubmitFail}
                            onStart={this.onSubmitStart}
                            onEnd={this.onSubmitEnd}
                    >
                        <Button size='sm' style={{"marginLeft":"15px"}} className="admin"  colors="primary">
                            <FormattedMessage
                                id="intl.button.submit"
                            />
                        </Button>
                    </BpmButtonSubmit>
                    <BpmButtonRecall
                            className="ml5 "
                            checkedArray = {selectData}
                            url = {`${GROBAL_HTTP_CTX}/DUBAN/recall`}
                            onSuccess = {this.onRecallSuc}
                            onError = {this.onRecallFail}
                            onStart = {this.onRecallStart}
                            onEnd={this.onSubmitEnd}
                    >
                        <Button size='sm' style={{"marginLeft":"15px"}} className="admin"  colors="primary">
                             <FormattedMessage
                            id="intl.button.recovery"
                        />
                        </Button>
                    </BpmButtonRecall>


                    <Button colors="primary" className="ml5" size='sm' onClick={() => { self.printExcel() }}>
                        <FormattedMessage
                            id="intl.button.print"
                        />
                    </Button>

                    <Button colors="primary" className="ml5" size='sm' onClick={ self.onLoadTemplate}>
                        <FormattedMessage
                            id="intl.button.templateDownload"
                        />
                    </Button>
                    <AcUpload
                        title={<FormattedMessage
                            id="intl.button.import"
                        />}
                        action={`${GROBAL_HTTP_CTX}/DUBAN/toImportExcel`}
                        multiple={false}
                        onError={() => console.log('上传报错了')}
                        onSuccess={self.handlerUploadSuccess}
                        onDelete={ self.handlerUploadDelete}
                    >
                        <Button className="ml5" colors="primary" size='sm'>
                            <FormattedMessage
                                id="intl.button.import"
                            />
                        </Button>
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
                <Loading container={this} show={showLoading} loadingType="line" />
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