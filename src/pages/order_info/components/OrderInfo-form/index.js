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

class OrderInfoForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            orderType: '',
            orderNo: '',
            refKeyArraypurOrg:"",
            releaseTime: '',
            orderAmount: '',
            refKeyArrayapplyNo:"",
            purGroupNo: '',
            purOrgSrc: '',
            confirmTime: '',
            applyName: '',
            orderState: '',
        }
    }
    componentWillMount(){
        // 获得单表orderinfo列表数据
        actions.OrderInfo.getOrderTypes();
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
                refKeyArraypurOrg,
                refKeyArrayapplyNo,
            } = this.state;
            if(refKeyArraypurOrg){
                values.purOrg = refKeyArraypurOrg
            }else {
                values.purOrg = "";
            }
            let orderAmount = values.orderAmount;
            if(orderAmount){
                if(Number(orderAmount)>0){
                values.orderAmount = Number(orderAmount);
                }else {
                delete values.orderAmount
                }
            }
            if(refKeyArrayapplyNo){
                values.applyNo = refKeyArrayapplyNo
            }else {
                values.applyNo = "";
            }
            await actions.OrderInfo.loadList(values);
        });


    }
    /**
     * 重置
     */
    reset = () => {
        this.setState({
            orderType:'',
            orderNo:'',
            purOrg:'',
            releaseTime:'',
            orderAmount:'',
            applyNo:'',
            purGroupNo:'',
            purOrgSrc:'',
            confirmTime:'',
            applyName:'',
            orderState:'',
            refKeyArraypurOrg:"",
            refKeyArrayapplyNo:"",
        })
    }
    render(){
        const { getFieldProps, getFieldError } = this.props.form;
        let { orderTypes } = this.props;
        let self = this;
        let {
            refKeyArraypurOrg,
            refKeyArrayapplyNo,
        } = this.state;
        return (
            <SearchPanel
                    className='OrderInfo-form'
                    form={this.props.form}
                    reset={this.reset}
                    search={this.search}>
                <Row>

                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>订单类型</Label>
                                    <Select
                                            {
                                            ...getFieldProps('orderType', {
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
                                    <Label>编号</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('orderNo', {
                                                initialValue: '',
                                            })
                                        }
                                    />
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>采购单位</Label>
                                    <RefWithInput option={options({
                                                  title: '采购单位',
                                        refType: 5,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'common_ref',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '5',
                                        },
                                        keyList:(refKeyArraypurOrg && refKeyArraypurOrg.split(',')) || [],//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArraypurOrg: temp.join(),
                                            })
                                        },
                                        showKey:'peoname',
                                        verification:true,//是否进行校验
                                        verKey:'purOrg',//校验字段
                                        verVal:""
                                    })} form={this.props.form}/>
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>订单金额</Label>
                                    <InputNumber
                                            precision={2}
                                            min={0}
                                            className={"input-number"}
                                            {
                                            ...getFieldProps('orderAmount', {
                                                    initialValue: '0.00',
                                                    //rules: [{type: 'string',pattern: /^(?:(?!0\.00$))[\d\D]*$/ig,message: '请输入数字'}],
                                            })
                                        }
                                    />
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>采购组编号</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('purGroupNo', {
                                                initialValue: '',
                                            })
                                        }
                                    />
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>订单状态</Label>
                                    <Radio.RadioGroup
                                            selectedValue={this.state.orderState||''}
                                            {
                                            ...getFieldProps('orderState', {
                                                initialValue: '',
                                                onChange(value) {
                                                    self.setState({ orderState: value });
                                                },
                                            })
                                        }
                                    >
                                        <Radio value="" >全部</Radio>
                                            <Radio value="0">交货</Radio>
                                            <Radio value="1">合同</Radio>
                                            <Radio value="2">意向</Radio>
                                    </Radio.RadioGroup>
                                </FormItem>
                            </Col>
                </Row>
            </SearchPanel>
        )
    }
}

export default Form.createForm()(OrderInfoForm)