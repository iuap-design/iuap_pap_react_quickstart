import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";
import queryString from 'query-string';
import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl';
import { Switch, InputNumber,Loading, Table, Button, Col, Row, Icon, InputGroup, FormControl, Checkbox, Modal, Panel, PanelGroup, Label, Message, Radio } from "tinper-bee";
import { BpmTaskApprovalWrap } from 'yyuap-bpm';
import AcUpload from 'ac-upload';
import Header from "components/Header";
import options from "components/RefOption";
import DatePicker from 'bee-datepicker';
import Form from 'bee-form';
import Select from 'bee-select';
import RefWithInput from 'yyuap-ref/dist2/refWithInput'
import moment from "moment";
import 'yyuap-ref/dist2/yyuap-ref.css'//参照样式
import './edit.less';
import 'ac-upload/build/ac-upload.css';
import ChildTableDubanSub from '../DubanSub-childtable';
import { setCookie, getCookie} from "utils";

const FormItem = Form.FormItem;
const Option = Select.Option;
const format = "YYYY-MM-DD HH:mm:ss";

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: {},
                refKeyArrayxbr:[],
                refKeyArrayzbr:[],
                refKeyArrayzrDw:[],
                refKeyArrayxbDw:[],
                refKeyArrayunitid:[],
                refKeyArrayzrr:[],
            // fileNameData: props.rowData.attachment || [],//上传附件数据
        }
    }
    async componentWillMount() {
        await actions.Duban.getOrderTypes();
        let searchObj = queryString.parse(this.props.location.search);
        let { btnFlag } = searchObj;
        if (btnFlag && btnFlag > 0) {
            let { search_id } = searchObj;
            let tempRowData = await actions.Duban.queryDetail({ search_id });
            let rowData = this.handleRefShow(tempRowData) || {};

            console.log('rowData',rowData);
            this.setState({
                rowData:rowData,
            })
        }

    }
    save = () => {//保存
        this.props.form.validateFields(async (err, values) => {
            values.attachment = this.state.fileNameData;
            let numArray = [
                "rwpf",
                "jdBl",
            ];
            for(let i=0,len=numArray.length; i<len; i++ ) {
                values[numArray[i]] = Number(values[numArray[i]]);
            }


            if (err) {
                Message.create({ content: '数据填写错误', color: 'danger' });
            } else {
                let {rowData,
                    refKeyArrayxbr,
                    refKeyArrayzbr,
                    refKeyArrayzrDw,
                    refKeyArrayxbDw,
                    refKeyArrayunitid,
                    refKeyArrayzrr,
                } = this.state;
                if (rowData && rowData.id) {
                    values.id = rowData.id;
                    values.ts = rowData.ts;
                }
                values.xbr = refKeyArrayxbr.join();
                values.zbr = refKeyArrayzbr.join();
                values.zrDw = refKeyArrayzrDw.join();
                values.xbDw = refKeyArrayxbDw.join();
                values.unitid = refKeyArrayunitid.join();
                values.zrr = refKeyArrayzrr.join();
                values.endDate = values.endDate.format(format);
                values.beginDate = values.beginDate.format(format);
                    let {childListDubanSub,cacheArrayDubanSub,delArrayDubanSub} = this.props;
                    // 编辑保存但是未修改参照,修改参照字段为参照id数组
                    if(childListDubanSub) {
                        childListDubanSub.map((item,index)=>{
                                    // 判断参照值是否有改动
                                    let uuid = item.uuid,
                                        refArray = [
                                            "subCode",
                                            "zbr",
                                        ],
                                        tempRefIdName =  [
                                            "subCodeName",
                                            "zbrName",
                                        ],
                                        target = cacheArrayDubanSub.filter(item=>item.uuid==uuid)[0];
                            // 处理单行多个参照
                                    for (let i=0,len=refArray.length; i<len; i++) {
                                        let tempRef = item[refArray[i]+uuid],
                                            tempShowName = item[tempRefIdName[i]];

                                        if(tempRef) {

                                            // 参照有改动
                                            item[refArray[i]] = tempRef;
                                        } else if(tempShowName) {

                                            // 参照无改动
                                            item[refArray[i]] = target[refArray[i]];
                                        }
                                    }


                        })
                    }
                    console.log('save childList',childListDubanSub)
                    console.log('save delArray',delArrayDubanSub);
                    // 添加删除的数组，删除的数组中dr项的值都为1
                    let resultArray = childListDubanSub.concat(delArrayDubanSub);

                    let commitData = {
                        entity : values,
                        sublist:{
                                dubanSubList:resultArray,
                        }
                    };
                    console.log("save values", JSON.stringify(commitData));


                await actions.Duban.save(
                    commitData,
                );
                // 置空缓存数据和删除数组
                await actions.Duban.updateState({
                        cacheArrayDubanSub:[],
                        delArrayDubanSub:[],
                })
            }
        });
    }

    // 处理参照回显
    handleRefShow = (tempRowData) => {
        let rowData = {};
        if(tempRowData){

            let {
                xbr,xbrName,
                zbr,zbrName,
                zrDw,zrdwName,
                xbDw,xbDwName,
                unitid,unitIdName,
                zrr,zrrName,
            } = tempRowData;

            this.setState({
                refKeyArrayxbr: xbr?xbr.split(','):[],
                refKeyArrayzbr: zbr?zbr.split(','):[],
                refKeyArrayzrDw: zrDw?zrDw.split(','):[],
                refKeyArrayxbDw: xbDw?xbDw.split(','):[],
                refKeyArrayunitid: unitid?unitid.split(','):[],
                refKeyArrayzrr: zrr?zrr.split(','):[],
            })
            rowData = Object.assign({},tempRowData,
                {
                    xbr:xbrName,
                    zbr:zbrName,
                    zrDw:zrdwName,
                    xbDw:xbDwName,
                    unitid:unitIdName,
                    zrr:zrrName,
                }
            )
        }
        return rowData;
    }

    onBack = async() => {
            await actions.Duban.updateState({
                    childListDubanSub: [],
                    cacheArraDubanSub:[],
                    delArrayDubanSub:[],
            })
        window.history.go(-1);
    }

    // 动态显示标题
    onChangeHead = (btnFlag) => {
        let titleArr = [   <FormattedMessage
            id="intl.duban.button.create"
        />,"编辑","详情"];
        return titleArr[btnFlag]||'新增';
    }
    //上传成功后的回调
    handlerUploadSuccess = (res) => {
        Message.create({content: '上传成功', color: 'success'});

        this.setState(({ fileNameData }) => {
            //拿到当前原始对象
            let newFileList = [];
            //找到历史数据合并
            newFileList = newFileList.concat(fileNameData,res.data);

            return {
                fileNameData: newFileList
            };
        });
    }
    //删除文件的回调
    handlerUploadDelete = (file) => {
        this.setState(({ fileNameData }) => {
            for (let i = 0; i < fileNameData.length; i++) {
                if (fileNameData[i].originalFileName == file.name) {
                    fileNameData[i]['del'] = 'del';
                }
            }
            return {
                fileNameData
            }
        });
    }

    // 跳转到流程图
    onClickToBPM = (rowData) => {
        console.log("actions", actions);
        actions.routing.push({
            pathname: 'Duban-chart',
            search: `?id=${rowData.id}`
        })
    }

    // 流程图相关回调函数
    onBpmStart = () => {
        actions.Duban.updateState({ showLoading: true });
    }
    onBpmEnd = () => {
        actions.Duban.updateState({ showLoading: false });
    }
    onBpmSuccess = () => {
        actions.Duban.updateState({ showLoading: false });
        // actions.routing.push('pagination-table');
        actions.routing.goBack();
    }
    onBpmError = () => {
        actions.Duban.updateState({ showLoading: false });
    }

    // 审批面板展示
    showBpmComponent = (btnFlag, appType, id, processDefinitionId, processInstanceId, rowData) => {
        // btnFlag为2表示为详情
        if ((btnFlag == 2) && rowData && rowData['id']) {
            console.log("showBpmComponent", btnFlag)
            return (
                <div >
                    {appType == 1 &&<BpmTaskApprovalWrap
                        id={rowData.id}
                        onBpmFlowClick={() => { this.onClickToBPM(rowData) }}
                        appType={appType}
                        onStart={this.onBpmStart}
                        onEnd={this.onBpmEnd}
                        onSuccess={this.onBpmSuccess}
                        onError={this.onBpmError}
                    />}
                    {appType == 2 &&<BpmTaskApprovalWrap
                        id={id}
                        processDefinitionId={processDefinitionId}
                        processInstanceId={processInstanceId}
                        onBpmFlowClick={() => { this.onClickToBPM(rowData) }}
                        appType={appType}
                        onStart={this.onBpmStart}
                        onEnd={this.onBpmEnd}
                        onSuccess={this.onBpmSuccess}
                        onError={this.onBpmError}
                    />}
                </div>

            );
        }
    }

    arryDeepClone = (array)=>{
        let result = [];
        if(array){
            array.map((item)=>{
                let temp = Object.assign([],item);
                result.push(temp);
            })
        }
    }

    // 通过search_id查询数据

    render() {
        const self = this;
        const {intl} = this.props;

        let { btnFlag,appType, id, processDefinitionId, processInstanceId } = queryString.parse(this.props.location.search);
        btnFlag = Number(btnFlag);
        let {rowData,
                    refKeyArrayxbr,
                    refKeyArrayzbr,
                    refKeyArrayzrDw,
                    refKeyArrayxbDw,
                    refKeyArrayunitid,
                    refKeyArrayzrr,
        } = this.state;

        let {
                cacheArrayDubanSub,
                delArrayDubanSub,
                childListDubanSub,
        } = this.props;

        let childObj = {
                cacheArrayDubanSub,
                delArrayDubanSub,
                childListDubanSub,
        }

        let title = this.onChangeHead(btnFlag);
        let { code,endDate,zrrName,xbr,zbr,rwpf,lyCode,qtLd,zrDw,jdBl,zrdwName,state,dbInfo,xbrName,xbDwName,kpiLevel,jfyq,xbDw,zbrName,beginDate,kpiFlag,unitIdName,lySm,dbr,name,unitid,zyCd,zrr, } = rowData;
        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <div className='Duban-detail'>
                <Loading
                    showBackDrop={true}
                    loadingType="line"
                    show={this.props.showLoading}
                />
                <Header title={title} back={true} backFn={this.onBack}>
                    {(btnFlag < 2) ? (
                        <div className='head-btn'>
                            <Button className='head-cancel' onClick={this.onBack}>取消</Button>
                            <Button className='head-save' onClick={this.save}>保存</Button>
                        </div>
                    ) : ''}
                </Header>
                {
                    self.showBpmComponent(btnFlag, appType ? appType : "1", id, processDefinitionId, processInstanceId, rowData)
                }
                <Row className='detail-body'>

                            <Col md={4} xs={6}>
                                <Label>
                                    督办编号：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||true}
                                        {
                                        ...getFieldProps('code', {
                                            validateTrigger: 'onBlur',
                                            initialValue: code || '',
                                            rules: [{
                                                message: '请输入督办编号',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('code')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label class="datepicker">
                                    计划结束时间：
                                </Label>
                                <DatePicker className='form-item' disabled={btnFlag == 2}
                                    format={format}
                                    {
                                    ...getFieldProps('endDate', {
                                        initialValue: endDate? moment(endDate):moment(),
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            required: true, message: '请选择计划结束时间',
                                        }],
                                    }
                                    )}
                                />


                                <span className='error'>
                                    {getFieldError('endDate')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    协办人：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                        title: '协办人',
                                        refType: 2,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'common_ref_table',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '2',
                                            locale:getCookie('u_locale'),
                                        },

                                        keyList:refKeyArrayxbr,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayxbr: temp,
                                            })
                                        },
                                        showKey:'peoname',
                                        verification:true,//是否进行校验
                                        verKey:'xbr',//校验字段
                                        verVal:xbr
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('xbr')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    主办人：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                        title: '主办人',
                                        refType: 6,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'bd_common_user',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '6',
                                            locale:getCookie('u_locale'),
                                        },

                                        keyList:refKeyArrayzbr,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayzbr: temp,
                                            })
                                        },
                                        showKey:'name',
                                        verification:true,//是否进行校验
                                        verKey:'zbr',//校验字段
                                        verVal:zbr
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('zbr')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    任务评分：
                                </Label>


                                    <InputNumber
                                        precision={2}
                                        min={0}
                                        className={"input-number"}
                                        disabled={btnFlag == 2}
                                        {
                                            ...getFieldProps('rwpf', {
                                                    initialValue: rwpf&&Number(rwpf).toFixed(2) || '0.00',
                                                    //rules: [{type: 'string',pattern: /^(?:(?!0\.00$))[\d\D]*$/ig,message: '请输入数字'}],
                                            })
                                        }
                                    />
                                <span className='error'>
                                    {getFieldError('rwpf')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    督办来源：
                                </Label>
                                    <Select disabled={btnFlag == 2}
                                        {
                                        ...getFieldProps('lyCode', {
                                            initialValue: lyCode || '',
                                            rules: [{
                                                type:'string',required: true, message: '请选择督办来源',
                                            }],
                                        }
                                        )}>
                                        <Option value=""><FormattedMessage
                                            id="intl.duban.table.source.option"
                                        /></Option>
                                        <Option value="1"><FormattedMessage
                                            id="intl.duban.table.source.leadOffice"
                                        /></Option>
                                        <Option value="2"><FormattedMessage
                                            id="intl.duban.table.source.meetingSummary"
                                        /></Option>
                                        <Option value="3"><FormattedMessage
                                            id="intl.duban.table.source.other"
                                        /></Option>
                                    </Select>


                                <span className='error'>
                                    {getFieldError('lyCode')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    牵头领导：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('qtLd', {
                                            validateTrigger: 'onBlur',
                                            initialValue: qtLd || '',
                                            rules: [{
                                                type:'string',required: true,pattern: /\S+/ig, message: '请输入牵头领导',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('qtLd')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    责任单位：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '责任单位',
                                        refType: 1,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'neworganizition',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '1',
                                            locale:getCookie('u_locale'),
                                        },

                                        keyList:refKeyArrayzrDw,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayzrDw: temp,
                                            })
                                        },
                                        showKey:'refname',
                                        verification:true,//是否进行校验
                                        verKey:'zrDw',//校验字段
                                        verVal:zrDw
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('zrDw')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    进度比例：
                                </Label>


                                    <InputNumber
                                        precision={2}
                                        min={0}
                                        className={"input-number"}
                                        disabled={btnFlag == 2}
                                        {
                                            ...getFieldProps('jdBl', {
                                                    initialValue: jdBl&&Number(jdBl).toFixed(2) || '0.00',
                                                    //rules: [{type: 'string',pattern: /^(?:(?!0\.00$))[\d\D]*$/ig,message: '请输入数字'}],
                                            })
                                        }
                                    />
                                <span className='error'>
                                    {getFieldError('jdBl')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    状态：
                                </Label>
                                    <Select disabled={btnFlag == 2}
                                        {
                                        ...getFieldProps('state', {
                                            initialValue: state || '',
                                            rules: [{
                                                type:'string',required: true, message: '请选择状态',
                                            }],
                                        }
                                        )}>
                                        <Option value="">请选择</Option>
                                            <Option value="0">未执行</Option>
                                            <Option value="1">已执行</Option>
                                    </Select>


                                <span className='error'>
                                    {getFieldError('state')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    督办事宜：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('dbInfo', {
                                            validateTrigger: 'onBlur',
                                            initialValue: dbInfo || '',
                                            rules: [{
                                                type:'string',required: true,pattern: /\S+/ig, message: '请输入督办事宜',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('dbInfo')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    kpi级别：
                                </Label>
                                    <Select disabled={btnFlag == 2}
                                        {
                                        ...getFieldProps('kpiLevel', {
                                            initialValue: kpiLevel || '',
                                            rules: [{
                                                type:'string',required: true, message: '请选择kpi级别',
                                            }],
                                        }
                                        )}>
                                        <Option value="">请选择</Option>
                                            <Option value="1">一级</Option>
                                            <Option value="2">二级</Option>
                                    </Select>


                                <span className='error'>
                                    {getFieldError('kpiLevel')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    交付要求：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('jfyq', {
                                            validateTrigger: 'onBlur',
                                            initialValue: jfyq || '',
                                            rules: [{
                                                type:'string',required: true,pattern: /\S+/ig, message: '请输入交付要求',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('jfyq')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    协办单位：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '协办单位',
                                        refType: 1,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'neworganizition',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '1',
                                            locale:getCookie('u_locale'),
                                        },

                                        keyList:refKeyArrayxbDw,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayxbDw: temp,
                                            })
                                        },
                                        showKey:'refname',
                                        verification:true,//是否进行校验
                                        verKey:'xbDw',//校验字段
                                        verVal:xbDw
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('xbDw')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label class="datepicker">
                                    计划开始时间：
                                </Label>
                                <DatePicker className='form-item' disabled={btnFlag == 2}
                                    format={format}
                                    {
                                    ...getFieldProps('beginDate', {
                                        initialValue: beginDate? moment(beginDate):moment(),
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            required: true, message: '请选择计划开始时间',
                                        }],
                                    }
                                    )}
                                />


                                <span className='error'>
                                    {getFieldError('beginDate')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    是否kpi：
                                </Label>
                                    <Select disabled={btnFlag == 2}
                                        {
                                        ...getFieldProps('kpiFlag', {
                                            initialValue: kpiFlag || '',
                                            rules: [{
                                                type:'string',required: true, message: '请选择是否kpi',
                                            }],
                                        }
                                        )}>
                                        <Option value="">请选择</Option>
                                            <Option value="1">是</Option>
                                            <Option value="0">否</Option>
                                    </Select>


                                <span className='error'>
                                    {getFieldError('kpiFlag')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    备注：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('lySm', {
                                            validateTrigger: 'onBlur',
                                            initialValue: lySm || '',
                                            rules: [{
                                                type:'string',required: true,pattern: /\S+/ig, message: '请输入备注',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('lySm')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    督办人：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('dbr', {
                                            validateTrigger: 'onBlur',
                                            initialValue: dbr || '',
                                            rules: [{
                                                type:'string',required: true,pattern: /\S+/ig, message: '请输入督办人',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('dbr')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    督办名称：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('name', {
                                            validateTrigger: 'onBlur',
                                            initialValue: name || '',
                                            rules: [{
                                                type:'string',required: true,pattern: /\S+/ig, message: '请输入督办名称',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('name')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    所属组织：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '所属组织',
                                        refType: 1,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'neworganizition',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '1',
                                            locale:getCookie('u_locale'),
                                        },

                                        keyList:refKeyArrayunitid,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayunitid: temp,
                                            })
                                        },
                                        showKey:'refname',
                                        verification:true,//是否进行校验
                                        verKey:'unitid',//校验字段
                                        verVal:unitid
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('unitid')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    重要程度：
                                </Label>
                                    <Select disabled={btnFlag == 2}
                                        {
                                        ...getFieldProps('zyCd', {
                                            initialValue: zyCd || '',
                                            rules: [{
                                                type:'string',required: true, message: '请选择重要程度',
                                            }],
                                        }
                                        )}>
                                        <Option value="">请选择</Option>
                                            <Option value="1">重要</Option>
                                            <Option value="0">一般</Option>
                                    </Select>


                                <span className='error'>
                                    {getFieldError('zyCd')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    责任人：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '责任人',
                                        refType: 4,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'checkbox_ref',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '4',
                                            locale:getCookie('u_locale'),
                                        },

                                        keyList:refKeyArrayzrr,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayzrr: temp,
                                            })
                                        },
                                        showKey:'refname',
                                        verification:true,//是否进行校验
                                        verKey:'zrr',//校验字段
                                        verVal:zrr
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('zrr')}
                                </span>
                            </Col>
                        {/* <Col md={4} xs={6}>
                            <Label>
                                附件：
                            </Label>
                            {
                                (btnFlag < 2) ? (<AcUpload
                                    title={"附件上传"}
                                    action={`${GROBAL_HTTP_CTX}/fileMananger/fastDfs/imgUpload`}
                                    multiple={false}
                                    defaultFileList={this.state.fileNameData}
                                    onError={() => console.log('上传报错了')}
                                    onSuccess={this.handlerUploadSuccess}
                                    onDelete={this.handlerUploadDelete}
                                >
                                    <Button colors="info">上传</Button>
                                </AcUpload>) : (
                                        <AcUpload
                                            title={"查看附件"}
                                            action={`${GROBAL_HTTP_CTX}/fileMananger/fastDfs/imgUpload`}
                                            defaultFileList={this.state.fileNameData}
                                            multiple={false}
                                            isView={true}
                                            onError={() => console.log('上传报错了')}
                                            onSuccess={this.handlerUploadSuccess}
                                        >
                                            <Button colors="info">查看</Button>
                                        </AcUpload>
                                    )
                            }
                        </Col> */}
                </Row>

                        <div className="master-tag">
                            <div className="childhead">
                                <span className="workbreakdown" >平台-督办任务子表</span>
                            </div>
                        </div>
                        <ChildTableDubanSub btnFlag={btnFlag} {...childObj}/>

            </div>
        )
    }
}

export default Form.createForm()(Edit);
