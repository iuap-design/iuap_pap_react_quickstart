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
        import ChildTableTrainSalesorderSub from '../TrainSalesorderSub-childtable';

const FormItem = Form.FormItem;
const Option = Select.Option;

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: {},
                salesman_name: '',
                distributionchannel: '',
                    refKeyArrayorganization:[],
                ORGANIZATION_NAME: '',
                ordernumber: '',
                client: '',
                    refKeyArraysalesman:[],
                remark: '',
                orderdate: '',
                deliverydate: '',
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
        await actions.TrainSalesorder.getOrderTypes();
        let searchObj = queryString.parse(this.props.location.search);
        let { btnFlag } = searchObj;
        if (btnFlag && btnFlag > 0) {
            let { search_id } = searchObj;
            let tempRowData = await actions.TrainSalesorder.queryDetail({ search_id });
            let rowData = {};
            if(tempRowData){
                        let temporganization = tempRowData.organization
                        let tempsalesman = tempRowData.salesman
               this.setState({
                           refKeyArrayorganization: temporganization?[temporganization]:[],
                           refKeyArraysalesman: tempsalesman?[tempsalesman]:[],
               })
               rowData = Object.assign({},tempRowData,
                        {organization:tempORGANIZATION_NAME},
                        {salesman:tempsalesman_name},
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
                        values.orderdate = values.orderdate.format('YYYY-MM-DD');
                        values.deliverydate = values.deliverydate.format('YYYY-MM-DD');
                    let {childListTrainSalesorderSub,cacheArrayTrainSalesorderSub,delArrayTrainSalesorderSub} = this.props;
                    // 编辑保存但是未修改参照,修改参照字段为参照id数组
                    if(childListTrainSalesorderSub) {
                        childListTrainSalesorderSub.map((item,index)=>{
                                    // 判断参照值是否有改动
                                    let uuid = item.uuid,
                                        refArray = ["materialid","storeman"],
                                        tempRefIdName = ["metarialIdName","storeManIdName"],
                                        target = cacheArrayTrainSalesorderSub.filter(item=>item.uuid==uuid)[0];

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

                                    /* let tempmaterialid = item["materialid"+uuid];
                                    let tempmetarialIdName = item["metarialIdName"]
                                    if(tempmaterialid){
                                        // 参照有改动
                                        item.materialid = tempmaterialid;
                                    }else if(tempmetarialIdName ){
                                        // 参照无改动
                                        let target = cacheArrayTrainSalesorderSub.filter(item=>item.uuid==uuid)[0];
                                        item.materialid = target.materialid;
                                    }
                                    let tempstoreman = item["storeman"+uuid];
                                    let tempStoremanName = item["storeManIdName"]
                                    if(tempstoreman){

                                        // 参照有改动
                                        item.storeman = tempstoreman;
                                    }else if(tempStoremanName ){

                                        // 参照无改动
                                        let target = cacheArrayTrainSalesorderSub.filter(item=>item.uuid==uuid)[0];
                                        item.storeman = target.storeman;
                                    } */




                                    /* let tempconfirmuser = item["confirmuser"+uuid];
                                    let tempCONFIRMPERSON_NAME = item["CONFIRMPERSON_NAME"]
                                    if(tempconfirmuser){
                                        // 参照有改动
                                        item.confirmuser = tempconfirmuser;
                                    }else if(tempCONFIRMPERSON_NAME ){
                                        // 参照无改动
                                        let target = cacheArrayTrainSalesorderSub.filter(item=>item.uuid==uuid)[0];
                                        item.confirmuser = target.confirmuser;
                                    } */

                        })
                    }
                    console.log('save childList',childListTrainSalesorderSub)
                    console.log('save delArray',delArrayTrainSalesorderSub);
                    // 添加删除的数组，删除的数组中dr项的值都为1
                    let resultArray = childListTrainSalesorderSub.concat(delArrayTrainSalesorderSub);

                    let commitData = {
                        entity : values,
                        sublist:{
                                trainSalesorderSubList:resultArray,
                        }
                    };
                    console.log("save values", JSON.stringify(commitData));
                await actions.TrainSalesorder.save(
                    commitData,
                );
                // 置空缓存数据和删除数组
                await actions.TrainSalesorder.updateState({
                        cacheArrayTrainSalesorderSub:[],
                        delArrayTrainSalesorderSub:[],
                })
            }
        });
    }

    handleRef = (item,) =>{

    }

    onBack = async() => {
            await actions.TrainSalesorder.updateState({
                    childListTrainSalesorderSub: [],
                    cacheArraTrainSalesorderSub:[],
                    delArrayTrainSalesorderSub:[],
            })
        window.history.go(-1);
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

    // 跳转到流程图
    onClickToBPM = (rowData) => {
        console.log("actions", actions);
        actions.routing.push({
            pathname: 'TrainSalesorder-chart',
            search: `?id=${rowData.id}`
        })
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
            cacheArrayTrainSalesorderSub,
            delArrayTrainSalesorderSub,
            childListTrainSalesorderSub,
        } = this.props;

        let childObj = {
            cacheArrayTrainSalesorderSub,
            delArrayTrainSalesorderSub,
            childListTrainSalesorderSub,
        }

        let title = this.onChangeHead(btnFlag);
        let { salesman_name,distributionchannel,organization,ORGANIZATION_NAME,ordernumber,client,salesman,remark,orderdate,deliverydate, } = rowData;
        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <div className='TrainSalesorder-detail'>
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
                                    销售渠道：
                                </Label>
                                    <Select disabled={btnFlag == 2}
                                        {
                                        ...getFieldProps('distributionchannel', {
                                            initialValue: distributionchannel || 'INNER',
                                            rules: [{
                                                type:'string',required: true, message: '请选择销售渠道',
                                            }],
                                        }
                                        )}>
                                        <Option value="">请选择</Option>
                                            <Option value="INNER">传统零售</Option>
                                            <Option value="LEVEL">分销代理</Option>
                                            <Option value="INTERNET">电商销售</Option>
                                    </Select>


                                <span className='error'>
                                    {getFieldError('distributionchannel')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    组织：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '',
                                        refType: 6,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'bd_common_org',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '6',
                                        },
                                        refModelUrl:{
                                            TreeUrl:'/newref/rest/iref_ctr/blobRefTree', //树请求
                                            TableBodyUrl:'/newref/rest/iref_ctr/blobRefTreeGrid',//表体请求//ref/rest/iref_ctr/blobRefTreeGrid
                                            TableBarUrl:'/newref/rest/iref_ctr/refInfo',//表头请求ref/rest/iref_ctr/refInfo
                                        },
                                        keyList:refKeyArrayorganization,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
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
                                        ...getFieldProps('ordernumber', {
                                            validateTrigger: 'onBlur',
                                            initialValue: ordernumber || '123',
                                            rules: [{
                                                type:'string',required: true, message: '请输入订单号',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('ordernumber')}
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
                                            initialValue: client || '123',
                                            rules: [{
                                                type:'string',required: true, message: '请输入客户',
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
                                    销售业务员：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '',
                                        refType: 5,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'common_ref',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '5',
                                        },
                                        keyList:refKeyArraysalesman,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
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
                                            initialValue: remark || '备注',
                                            rules: [{
                                                type:'string',required: true, message: '请输入备注',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('remark')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label class="datepicker">
                                    订单日期：
                                </Label>
                                <DatePicker className='form-item' disabled={btnFlag == 2}
                                    format="YYYY-MM-DD"
                                    {
                                    ...getFieldProps('orderdate', {
                                        initialValue: moment(orderdate),
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            required: true, message: '请选择订单日期',
                                        }],
                                    }
                                    )}
                                />


                                <span className='error'>
                                    {getFieldError('orderdate')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label class="datepicker">
                                    截止日期：
                                </Label>
                                <DatePicker className='form-item' disabled={btnFlag == 2}
                                    format="YYYY-MM-DD"
                                    {
                                    ...getFieldProps('deliverydate', {
                                        initialValue: moment(deliverydate),
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            required: true, message: '请选择发货截止日期',
                                        }],
                                    }
                                    )}
                                />


                                <span className='error'>
                                    {getFieldError('deliverydate')}
                                </span>
                            </Col>
                        <Col md={4} xs={6}>
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
                        </Col>
                </Row>

                        <div className="master-tag">
                            <div className="childhead">
                                <span className="workbreakdown" >销售订单子表</span>
                            </div>
                        </div>
                        <ChildTableTrainSalesorderSub btnFlag={btnFlag} {...childObj}/>

            </div>
        )
    }
}

export default Form.createForm()(Edit);