import React, { Component } from 'react'
import { actions } from "mirrorx";
import { Col, Row,FormControl, Label, Select, Radio } from "tinper-bee";
import Form from 'bee-form';
import DatePicker from 'bee-datepicker';
import 'bee-datepicker/build/DatePicker.css';
import SearchPanel from 'components/SearchPanel';
const FormItem = Form.FormItem;
const { RangePicker } = DatePicker;
import './index.less'

class OrderInfoForm extends Component {
    constructor(props){
        super(props)
        this.state = {
        orderNo:'',
        purOrg:'',
        applyNo:'',
        purGroupNo:'',
        releaseTime:'',
        confirmTime:'',
        orderType:'',
        orderState:'',
        orderAmount:'',
        isPaid:'',
        }
    }
    componentWillMount(){
        // 获得订单类型列表数据
        actions.OrderInfo.getOrderTypes();
    }
    /** 查询数据
     * @param {*} error 校验是否成功
     * @param {*} values 表单数据
     */
    search = (error,values) => {
        this.props.form.validateFields((err, values) => {
            values.pageIndex = this.props.pageIndex || 0;
            values.pageSize = this.props.pageSize || 10;

            actions.OrderInfo.loadList(values);
        });

        
    }
    /**
     * 重置
     */
    reset = () => {
        this.setState({
            orderNo:'',
            purOrg:'',
            applyNo:'',
            purGroupNo:'',
            releaseTime:'',
            confirmTime:'',
            orderType:'',
            orderState:'',
            orderAmount:'',
            isPaid:'',
        })
    }
    render(){
        const { getFieldProps, getFieldError } = this.props.form;
        let { orderTypes } = this.props;
        let _this = this;
        return (
            <SearchPanel 
                className='OrderInfo-form' 
                form={this.props.form} 
                reset={this.reset} 
                search={this.search}>
                <Row>

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
                            <FormControl
                                {
                                    ...getFieldProps('purOrg', {
                                        initialValue: '',
                                    })
                                }
                            />
                        </FormItem>
                    </Col>
		            <Col md={4} xs={6}>
                        <FormItem>
                            <Label>供应商编号</Label>
                            <FormControl
                                {
                                    ...getFieldProps('applyNo', {
                                        initialValue: '',
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
                            <Label>发布时间</Label>
                            <RangePicker
                            defaultValue={this.state.releaseTime}
                            placeholder={'开始 ~ 结束'}
                            dateInputPlaceholder={['开始', '结束']}
                            {
                                ...getFieldProps('releaseTime', {
                                    initialValue:'',
                                    onChange:  (v)=> {
                                        this.setState({
                                            releaseTime: v
                                        })
                                    }
                                })
                            }
                            />
                        </FormItem>
                    </Col>
		            <Col md={4} xs={6}>
                        <FormItem>
                            <Label>确认时间</Label>
                            <RangePicker
                            defaultValue={this.state.confirmTime}
                            placeholder={'开始 ~ 结束'}
                            dateInputPlaceholder={['开始', '结束']}
                            {
                                ...getFieldProps('confirmTime', {
                                    initialValue:'',
                                    onChange:  (v)=> {
                                        this.setState({
                                            confirmTime: v
                                        })
                                    }
                                })
                            }
                            />
                        </FormItem>
                    </Col>
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
                            <Label>订单状态</Label>
                            <Radio.RadioGroup
                            selectedValue={this.state.orderState||'0'}
                                {
                                    ...getFieldProps('orderState', {
                                        initialValue: '',
                                        onChange(value) {
                                            _this.setState({ orderState: value });
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
		            <Col md={4} xs={6}>
                        <FormItem>
                            <Label>订单金额</Label>
                            <FormControl
                                {
                                    ...getFieldProps('orderAmount', {
                                        initialValue: '',
                                    })
                                }
                            />
                        </FormItem>
                    </Col>
		            <Col md={4} xs={6}>
                        <FormItem>
                            <Label>是否付款</Label>
                        </FormItem>
                    </Col>
                </Row>
            </SearchPanel>
        )
    }
}

export default Form.createForm()(OrderInfoForm)