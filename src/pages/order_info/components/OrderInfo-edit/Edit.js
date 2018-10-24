import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";
import queryString from 'query-string';
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

const FormItem = Form.FormItem;
const Option = Select.Option;
const format = "YYYY-MM-DD HH:mm:ss";

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: {},
                refKeyArraypurOrg:[],
                refKeyArrayapplyNo:[],
            fileNameData: props.rowData.attachment || [],//上传附件数据
        }
    }
    async componentWillMount() {
        await actions.OrderInfo.getOrderTypes();
        let searchObj = queryString.parse(this.props.location.search);
        let { btnFlag } = searchObj;
        if (btnFlag && btnFlag > 0) {
            let { search_id } = searchObj;
            let tempRowData = await actions.OrderInfo.queryDetail({ search_id });
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
                "orderAmount",
            ];
            for(let i=0,len=numArray.length; i<len; i++ ) {
                values[numArray[i]] = Number(values[numArray[i]]);
            }


            if (err) {
                Message.create({ content: '数据填写错误', color: 'danger' });
            } else {
                let {rowData,
                    refKeyArraypurOrg,
                    refKeyArrayapplyNo,
                } = this.state;
                if (rowData && rowData.id) {
                    values.id = rowData.id;
                    values.ts = rowData.ts;
                }
                values.purOrg = refKeyArraypurOrg.join();
                values.applyNo = refKeyArrayapplyNo.join();
                values.releaseTime = values.releaseTime.format(format);
                values.confirmTime = values.confirmTime.format(format);

                await actions.OrderInfo.save(
                    values,
                );
            }
        });
    }

    // 处理参照回显
    handleRefShow = (tempRowData) => {
        let rowData = {};
        if(tempRowData){

            let {
                purOrg,purOrgSrc,
                applyNo,applyName,
            } = tempRowData;

            this.setState({
                refKeyArraypurOrg: purOrg?purOrg.split(','):[],
                refKeyArrayapplyNo: applyNo?applyNo.split(','):[],
            })
            rowData = Object.assign({},tempRowData,
                {
                    purOrg:purOrgSrc,
                    applyNo:applyName,
                }
            )
        }
        return rowData;
    }

    onBack = async() => {
        window.history.go(-1);
    }

    // 动态显示标题
    onChangeHead = (btnFlag) => {
        let titleArr = ["新增","编辑","详情"];
        return titleArr[btnFlag]||'新增';
    }
    //上传成功后的回调
    handlerUploadSuccess = (res) => {
        Message.create({content: '上传成功', color: 'success'});
        let searchObj = queryString.parse(this.props.location.search);
        let id = searchObj.search_id;

        this.setState(({ fileNameData }) => {
            //拿到当前原始对象
            let newFileList = [];
            //找到历史数据合并
            //原始数据合并新数据
            newFileList = newFileList.concat(fileNameData, res.data);
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
            pathname: 'OrderInfo-chart',
            search: `?id=${rowData.id}`
        })
    }

    // 流程图相关回调函数
    onBpmStart = () => {
        actions.OrderInfo.updateState({ showLoading: true });
    }
    onBpmEnd = () => {
        actions.OrderInfo.updateState({ showLoading: false });
    }
    onBpmSuccess = () => {
        actions.OrderInfo.updateState({ showLoading: false });
        // actions.routing.push('pagination-table');
        actions.routing.goBack();
    }
    onBpmError = () => {
        actions.OrderInfo.updateState({ showLoading: false });
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

        let { btnFlag,appType, id, processDefinitionId, processInstanceId } = queryString.parse(this.props.location.search);
        btnFlag = Number(btnFlag);
        let {rowData,
                    refKeyArraypurOrg,
                    refKeyArrayapplyNo,
        } = this.state;


        let title = this.onChangeHead(btnFlag);
        let { orderType,orderNo,purOrg,releaseTime,orderAmount,applyNo,purGroupNo,purOrgSrc,confirmTime,applyName,orderState, } = rowData;
        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <div className='OrderInfo-detail'>
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
                                    订单类型：
                                </Label>
                                    <Select disabled={btnFlag == 2}
                                        {
                                        ...getFieldProps('orderType', {
                                            initialValue: orderType || '',
                                            rules: [{
                                                type:'string',required: true, message: '请选择订单类型',
                                            }],
                                        }
                                        )}>
                                        <Option value="">请选择</Option>
                                            <Option value="0">生产订单</Option>
                                            <Option value="1">日常订单</Option>
                                            <Option value="2">临时订单</Option>
                                            <Option value="3">测试订单</Option>
                                    </Select>


                                <span className='error'>
                                    {getFieldError('orderType')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    编号：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('orderNo', {
                                            validateTrigger: 'onBlur',
                                            initialValue: orderNo || '',
                                            rules: [{
                                                type:'string',required: true,pattern: /\S+/ig, message: '请输入编号',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('orderNo')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    采购单位：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '采购单位',
                                        refType: 5,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'common_ref',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '5',
                                        },

                                        keyList:refKeyArraypurOrg,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArraypurOrg: temp,
                                            })
                                        },
                                        showKey:'peoname',
                                        verification:true,//是否进行校验
                                        verKey:'purOrg',//校验字段
                                        verVal:purOrg
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('purOrg')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label className="datepicker">
                                    发布时间：
                                </Label>
                                <DatePicker className='form-item' disabled={btnFlag == 2}
                                    format={format}
                                    {
                                    ...getFieldProps('releaseTime', {
                                        initialValue: releaseTime? moment(releaseTime):moment(),
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            required: true, message: '请选择发布时间',
                                        }],
                                    }
                                    )}
                                />


                                <span className='error'>
                                    {getFieldError('releaseTime')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    订单金额：
                                </Label>


                                    <InputNumber
                                        precision={2}
                                        min={0}
                                        className={"input-number"}
                                        disabled={btnFlag == 2}
                                        {
                                            ...getFieldProps('orderAmount', {
                                                    initialValue: orderAmount&&Number(orderAmount).toFixed(2) || '0.00',
                                                    //rules: [{type: 'string',pattern: /^(?:(?!0\.00$))[\d\D]*$/ig,message: '请输入数字'}],
                                            })
                                        }
                                    />
                                <span className='error'>
                                    {getFieldError('orderAmount')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    供应商编号：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '供应商编号',
                                        refType: 6,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'bd_common_org',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '6',
                                        },

                                        keyList:refKeyArrayapplyNo,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayapplyNo: temp,
                                            })
                                        },
                                        showKey:'name',
                                        verification:true,//是否进行校验
                                        verKey:'applyNo',//校验字段
                                        verVal:applyNo
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('applyNo')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    采购组编号：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('purGroupNo', {
                                            validateTrigger: 'onBlur',
                                            initialValue: purGroupNo || '',
                                            rules: [{
                                                type:'string',required: true,pattern: /\S+/ig, message: '请输入采购组编号',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('purGroupNo')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label className="datepicker">
                                    确认时间：
                                </Label>
                                <DatePicker className='form-item' disabled={btnFlag == 2}
                                    format={format}
                                    {
                                    ...getFieldProps('confirmTime', {
                                        initialValue: confirmTime? moment(confirmTime):moment(),
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            required: true, message: '请选择确认时间',
                                        }],
                                    }
                                    )}
                                />


                                <span className='error'>
                                    {getFieldError('confirmTime')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    订单状态：
                                </Label>

                                    {
                                        (btnFlag < 2) ?
                                            (<Radio.RadioGroup
                                                disabled={true}
                                                selectedValue={orderState||''}
                                                {
                                                ...getFieldProps('orderState', {
                                                    initialValue: orderState||'',
                                                    validateTrigger: 'onBlur',
                                                    rules: [{
                                                        required: true, message: '请选择订单状态',
                                                    }],
                                                    onChange(value) {
                                                        let tempRow = Object.assign({},rowData,{ orderState: value });
                                                        self.setState({
                                                            rowData:tempRow
                                                        })
                                                    },
                                                }
                                                )}
                                            >
                                                <Radio value={"0"}>交货</Radio>
                                                <Radio value={"1"}>合同</Radio>
                                                <Radio value={"2"}>意向</Radio>
                                            </Radio.RadioGroup>) : (
                                                <FormControl disabled={btnFlag == 2} value={orderState} />
                                            )
                                    }


                                <span className='error'>
                                    {getFieldError('orderState')}
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


            </div>
        )
    }
}

export default Form.createForm()(Edit);
