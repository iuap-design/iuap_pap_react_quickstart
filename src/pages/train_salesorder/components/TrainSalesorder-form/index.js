import React, { Component } from 'react'
import { actions } from "mirrorx";
import { Switch, InputNumber, Col, Row,FormControl, Label, Select, Radio } from "tinper-bee";
import Form from 'bee-form';
import DatePicker from 'bee-datepicker';
import 'bee-datepicker/build/DatePicker.css';
import SearchPanel from 'components/SearchPanel';
const FormItem = Form.FormItem;
import options from "components/RefOption";
const { RangePicker } = DatePicker;
import RefWithInput from 'yyuap-ref/dist2/refWithInput'
import 'yyuap-ref/dist2/yyuap-ref.css'//参照样式
import './index.less'

class TrainSalesorderForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            salesman_name: '',
            distributionchannel: '',
            refKeyArrayorganization:"",
            ORGANIZATION_NAME: '',
            ordernumber: '',
            client: '',
            refKeyArraysalesman:"",
            remark: '',
            orderdate: '',
            deliverydate: '',
        }
    }
    componentWillMount(){
        // 获得销售订单列表数据
        actions.TrainSalesorder.getOrderTypes();
    }
    /** 查询数据
     * @param {*} error 校验是否成功
     * @param {*} values 表单数据
     */
    search = (error,values) => {
        this.props.form.validateFields(async (err, values) => {
            values.pageIndex = this.props.pageIndex || 0;
            values.pageSize = this.props.pageSize || 10;
            let {
                refKeyArrayorganization,
                refKeyArraysalesman,
            } = this.state;
            if(refKeyArrayorganization){
                values.organization = refKeyArrayorganization
            }else {
                values.organization = "";
            }
            if(refKeyArraysalesman){
                values.salesman = refKeyArraysalesman
            }else {
                values.salesman = "";
            }
            await actions.TrainSalesorder.loadList(values);
            this.setState({
                refKeyArrayorganization:"",
                refKeyArraysalesman:"",
            });
            this.props.form.setFieldsValue({
                organization:"",
                salesman:"",
            })
        });


    }
    /**
     * 重置
     */
    reset = () => {
        this.setState({
    salesman_name:'',
    distributionchannel:'',
    organization:'',
    ORGANIZATION_NAME:'',
    ordernumber:'',
    client:'',
    salesman:'',
    remark:'',
    orderdate:'',
    deliverydate:'',
        })
    }
    render(){
        const { getFieldProps, getFieldError } = this.props.form;
        let { orderTypes } = this.props;
        let self = this;
        let {
            refKeyArrayorganization,
            refKeyArraysalesman,
        } = this.state;
        return (
            <SearchPanel
                    className='TrainSalesorder-form'
                    form={this.props.form}
                    reset={this.reset}
                    search={this.search}>
                <Row>

                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>销售渠道</Label>
                                    <Select
                                            {
                                            ...getFieldProps('distributionchannel', {
                                            initialValue: '',
                                        })
                                    }
                                    >
                                            <Option value="">请选择</Option>
                                            {
                                                orderTypes.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item.code}>{item.name}</Option>
                                                    )
                                                })
                                    }
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>组织</Label>
                                    <RefWithInput option={options({
                                                  title: '',
                                        refType: 6,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'bd_common_org',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '6',
                                        },
                                        keyList:[],//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayorganization: temp.join(),
                                            })
                                        },
                                        showKey:'name',
                                        verification:true,//是否进行校验
                                        verKey:'organization',//校验字段
                                        verVal:""
                                    })} form={this.props.form}/>
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>订单号</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('ordernumber', {
                                                initialValue: '',
                                            })
                                        }
                                    />
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>客户</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('client', {
                                                initialValue: '',
                                            })
                                        }
                                    />
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>订单日期</Label>
                                    <RangePicker
                                            defaultValue={this.state.orderdate}
                                            placeholder={'开始 ~ 结束'}
                                    dateInputPlaceholder={['开始', '结束']}
                                    {
                                        ...getFieldProps('orderdate', {
                                            initialValue:'',
                                            onChange:  (v)=> {
                                                this.setState({
                                        orderdate: v
                                                })
                                            }
                                        })
                                    }
                                    />
                                </FormItem>
                            </Col>
                </Row>
            </SearchPanel>
        )
    }
}

export default Form.createForm()(TrainSalesorderForm)