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
import ChildTableTrainSaleOrderSub from '../TrainSaleOrderSub-childtable';

const FormItem = Form.FormItem;
const Option = Select.Option;

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: {},
        	    refKeyArrayorganization:[],
                orderNumber: '',
                orderDate: '',
                distributionChannel: '',
                deliveryDate: '',
                client: '',
                orderAmount: '',
        	    refKeyArraysalesman:[],
                remark: '',
                fileNameData: props.rowData.attachment || [],//上传附件数据
        }
    }
    async componentWillMount() {
        if (this.props.rowData && this.props.rowData.id) {
            let { approvalState, closeState, confirmState } = this.props.rowData;
            this.setState({
                approvalState: String(approvalState),
                closeState: String(closeState),
                confirmState: String(confirmState)
            })
        }
        await actions.TrainSaleOrder.getOrderTypes();
        let searchObj = queryString.parse(this.props.location.search);
        let { btnFlag } = searchObj;
        if (btnFlag && btnFlag > 0) {
            let { search_id } = searchObj;
            let tempRowData = await actions.TrainSaleOrder.queryDetail({ search_id });
            let rowData = {};
            if(tempRowData){
                        let temporganization = tempRowData.organization
                        let temporganizationStr = tempRowData.organizationStr
                        let tempsalesman = tempRowData.salesman
                        let tempsalesmanName = tempRowData.salesmanName
               this.setState({
                           refKeyArrayorganization: temporganization?[temporganization]:[],
                           refKeyArraysalesman: tempsalesman?[tempsalesman]:[],
               })
               rowData = Object.assign({},tempRowData,
                        {organization:temporganizationStr},
                        {salesman:tempsalesmanName},
               )
            }
            console.log('rowData',rowData);
            this.setState({
                rowData:rowData,
            })
        }

    }
    save = () => {//保存
        this.props.form.validateFields(async (err, values) => {
            values.attachment = this.state.fileNameData;
            if (err) {
                Message.create({ content: '数据填写错误', color: 'danger' });
            } else {
                let {rowData,
                            refKeyArrayorganization,







                            refKeyArraysalesman,


                } = this.state;
                if (rowData && rowData.id) {
                    values.id = rowData.id;
                    values.ts = rowData.ts;
                }
                        values.organization = refKeyArrayorganization.join();
                        values.salesman = refKeyArraysalesman.join();
                    let {childListTrainSaleOrderSub,cacheArrayTrainSaleOrderSub,delArrayTrainSaleOrderSub} = this.props;
                    // 编辑保存但是未修改参照,修改参照字段为参照id数组
                    if(childListTrainSaleOrderSub) {
                        childListTrainSaleOrderSub.map((item,index)=>{
                                    // 判断参照值是否有改动
                                    let uuid = item.uuid;
                                    let temp = item["confirmUser"+uuid];
                                    let tempconfirmUserName = item["confirmUserName"]
                                    if(temp){
                                        // 参照有改动
                                        item.confirmUser = temp;
                                    }else if(tempconfirmUserName ){
                                        // 参照无改动
                                        let target = cacheArrayTrainSaleOrderSub.filter(item=>item.uuid==uuid)[0];
                                        item.confirmUser = target.confirmUser;
                                    }

                        })
                    }
                    console.log('save childList',childListTrainSaleOrderSub)
                    console.log('save delArray',delArrayTrainSaleOrderSub);
                    // 添加删除的数组，删除的数组中dr项的值都为1
                    let resultArray = childListTrainSaleOrderSub.concat(delArrayTrainSaleOrderSub);

                    let commitData = {
                        entity : values,
                        sublist:{
                                trainSaleOrderSubList:resultArray,
                        }
                    };
                    console.log("save values", JSON.stringify(commitData));
                await actions.TrainSaleOrder.save(
                    commitData,
                );
                // 置空缓存数据和删除数组
                await actions.TrainSaleOrder.updateState({
                        cacheArrayTrainSaleOrderSub:[],
                        delArrayTrainSaleOrderSub:[],
                })
                console.log("save values", JSON.stringify(values));
                actions.TrainSaleOrder.save(values);
            }
        });
    }
    onBack = async() => {
            await actions.TrainSaleOrder.updateState({
                    childListTrainSaleOrderSub: [],
                    cacheArraTrainSaleOrderSub:[],
                    delArrayTrainSaleOrderSub:[],
            })
        window.history.go(-1);
    }
    // 跳转到流程图
    onClickToBPM = (rowData) => {
        console.log("actions", actions);
        actions.routing.push({
            pathname: 'TrainSaleOrder-chart',
            search: `?id=${rowData.id}`
        })
    }

    // 动态显示标题
    onChangeHead = (btnFlag) => {
        let msg = "";
        switch (btnFlag) {
            case 0:
                msg = "新增";
                break;
            case 1:
                msg = "编辑";
                break;
            case 2:
                msg = "详情"
                break;
        }
        return msg;
    }

    //上传成功后的回调
    handlerUploadSuccess = (data) => {
        let searchObj = queryString.parse(this.props.location.search);
        let id = searchObj.search_id;
        if (searchObj.btnFlag == 0) {

        } else if (searchObj.btnFlag == 1) {
            // if (data.length > 0) {
            //     data[0]['id'] = id;
            // }
        }

        this.setState(({ fileNameData }) => {
            //拿到当前原始对象
            let newFileList = [];
            //找到历史数据合并
            newFileList = newFileList.concat(fileNameData);
            //原始数据合并新数据
            newFileList = newFileList.concat(data);
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

    showBpmComponent = (btnFlag, rowData) => {
        // btnFlag为2表示为详情
        if ((btnFlag == 2) && rowData && rowData['id']) {
            console.log("showBpmComponent", btnFlag)
            return (
                <BpmTaskApprovalWrap
                    id={rowData.id}
                    onBpmFlowClick={() => { this.onClickToBPM(rowData) }}
                    appType={"1"}
                />
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

        let { btnFlag } = queryString.parse(this.props.location.search);
        btnFlag = Number(btnFlag);
        let {rowData,
                    refKeyArrayorganization,
                    refKeyArraysalesman,
        } = this.state;

        let {
                cacheArrayTrainSaleOrderSub,
                delArrayTrainSaleOrderSub,
                childListTrainSaleOrderSub,
        } = this.props;

        let childObj = {
                cacheArrayTrainSaleOrderSub,
                delArrayTrainSaleOrderSub,
                childListTrainSaleOrderSub,
        }

        let title = this.onChangeHead(btnFlag);
        let { organization,orderNumber,orderDate,distributionChannel,deliveryDate,client,orderAmount,salesman,remark, } = rowData;
        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <div className='TrainSaleOrder-detail'>
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
                    self.showBpmComponent(btnFlag, rowData)
                }
                <Row className='detail-body'>

                        <Col md={4} xs={6}>
                            <Label>
                            组织：
                            </Label>
                                <RefWithInput disabled={btnFlag == 2} option={Object.assign(JSON.parse(options),{
                                              title: '',
                                    refType: 6,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                    className: '',
                                    param: {//url请求参数
                                        refCode: 'bd_common_org',
                                        tenantId: '',
                                        sysId: '',
                                        transmitParam: 'EXAMPLE_CONTACTS,EXAMPLE_ORGANIZATION',
                                    },
                                    keyList:refKeyArrayorganization,//选中的key
                                    onSave: function (sels) {
                                        console.log(sels);
                                        var temp = sels.map(v => v.key)
                                        console.log("temp",temp);
                                        self.setState({
                                            refKeyArrayorganization: temp,
                                        })
                                    },
                                    showKey:'name',
                                    verification:true,//是否进行校验
                                    verKey:'organization',//校验字段
                                    verVal:organization
                                })} form={this.props.form}/>

                            <span className='error'>
                                {getFieldError('organization')}
                            </span>
                        </Col>
                        <Col md={4} xs={6}>
                            <Label>
                            订单号：
                            </Label>
                                <FormControl disabled={btnFlag == 2}
                                    {
                                    ...getFieldProps('orderNumber', {
                                        validateTrigger: 'onBlur',
                                        initialValue: orderNumber || '',
                                        rules: [{
                                            type:'string',required: true, message: '请输入ORDERNUMBER',
                                        }],
                                    }
                                    )}
                                />

                            <span className='error'>
                                {getFieldError('orderNumber')}
                            </span>
                        </Col>
                        <Col md={4} xs={6}>
                            <Label class="datepicker">
                            订单日期：
                            </Label>
                            <DatePicker className='form-item' disabled={btnFlag == 2}
                                format="YYYY-MM-DD"
                                {
                                ...getFieldProps('orderDate', {
                                    initialValue: moment(orderDate),
                                    validateTrigger: 'onBlur',
                                    rules: [{
                                        required: true, message: '请选择ORDERDATE',
                                    }],
                                }
                                )}
                            />

                            <span className='error'>
                                {getFieldError('orderDate')}
                            </span>
                        </Col>
                        <Col md={4} xs={6}>
                            <Label>
                            销售渠道：
                            </Label>
                                <Select disabled={btnFlag == 2}
                                    {
                                    ...getFieldProps('distributionChannel', {
                                        initialValue: distributionChannel || '',
                                        rules: [{
                                            type:'string',required: true, message: '请选择DISTRIBUTIONCHANNEL',
                                        }],
                                    }
                                    )}>
                                    <Option value="">请选择</Option>
                                        <Option value="0">线上</Option>
                                        <Option value="1">线下</Option>
                                </Select>

                            <span className='error'>
                                {getFieldError('distributionChannel')}
                            </span>
                        </Col>
                        <Col md={4} xs={6}>
                            <Label class="datepicker">
                            交货日期：
                            </Label>
                            <DatePicker className='form-item' disabled={btnFlag == 2}
                                format="YYYY-MM-DD"
                                {
                                ...getFieldProps('deliveryDate', {
                                    initialValue: moment(deliveryDate),
                                    validateTrigger: 'onBlur',
                                    rules: [{
                                        required: true, message: '请选择DELIVERYDATE',
                                    }],
                                }
                                )}
                            />

                            <span className='error'>
                                {getFieldError('deliveryDate')}
                            </span>
                        </Col>
                        <Col md={4} xs={6}>
                            <Label>
                            客户：
                            </Label>
                                <FormControl disabled={btnFlag == 2}
                                    {
                                    ...getFieldProps('client', {
                                        validateTrigger: 'onBlur',
                                        initialValue: client || '',
                                        rules: [{
                                            type:'string',required: true, message: '请输入CLIENT',
                                        }],
                                    }
                                    )}
                                />

                            <span className='error'>
                                {getFieldError('client')}
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
                                                rules: [{type: 'string',pattern: /^(?:(?!0\.00$))[\d\D]*$/ig,message: '请输入数字'}],
                                        })
                                    }
                                />
                            <span className='error'>
                                {getFieldError('orderAmount')}
                            </span>
                        </Col>
                        <Col md={4} xs={6}>
                            <Label>
                            经办业务员：
                            </Label>
                                <RefWithInput disabled={btnFlag == 2} option={Object.assign(JSON.parse(options),{
                                              title: '',
                                    refType: 5,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                    className: '',
                                    param: {//url请求参数
                                        refCode: 'common_ref',
                                        tenantId: '',
                                        sysId: '',
                                        transmitParam: 'EXAMPLE_CONTACTS,EXAMPLE_ORGANIZATION',
                                    },
                                    keyList:refKeyArraysalesman,//选中的key
                                    onSave: function (sels) {
                                        console.log(sels);
                                        var temp = sels.map(v => v.key)
                                        console.log("temp",temp);
                                        self.setState({
                                            refKeyArraysalesman: temp,
                                        })
                                    },
                                    showKey:'peoname',
                                    verification:true,//是否进行校验
                                    verKey:'salesman',//校验字段
                                    verVal:salesman
                                })} form={this.props.form}/>

                            <span className='error'>
                                {getFieldError('salesman')}
                            </span>
                        </Col>
                        <Col md={4} xs={6}>
                            <Label>
                            备注：
                            </Label>
                                <FormControl disabled={btnFlag == 2}
                                    {
                                    ...getFieldProps('remark', {
                                        validateTrigger: 'onBlur',
                                        initialValue: remark || '',
                                        rules: [{
                                            type:'string',required: true, message: '请输入REMARK',
                                        }],
                                    }
                                    )}
                                />

                            <span className='error'>
                                {getFieldError('remark')}
                            </span>
                        </Col>
                        <Col md={4} xs={6}>
                            <Label>
                                附件：
                            </Label>
                            {
                                (btnFlag < 2) ? (<AcUpload
                                    title={"附件上传"}
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
                        </Col>

                </Row>

                    <div className="master-tag">
                        <div className="childhead">
                            <span className="workbreakdown" >任务分解</span>
                        </div>
                    </div>
                        <ChildTableTrainSaleOrderSub btnFlag={btnFlag} {...childObj}/>

            </div>
        )
    }
}

export default Form.createForm()(Edit);