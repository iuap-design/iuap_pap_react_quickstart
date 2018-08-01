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

class TrainSaleOrderForm extends Component {
    constructor(props){
        super(props)
        this.state = {
        organization:'',
        orderNumber:'',
        orderDate:'',
        distributionChannel:'',
        deliveryDate:'',
        client:'',
        orderAmount:'',
        salesman:'',
        remark:'',
        }
    }
    componentWillMount(){
        // 获得订单类型列表数据
        actions.TrainSaleOrder.getOrderTypes();
    }
    /** 查询数据
     * @param {*} error 校验是否成功
     * @param {*} values 表单数据
     */
    search = (error,values) => {
        this.props.form.validateFields((err, values) => {
            values.pageIndex = this.props.pageIndex || 0;
            values.pageSize = this.props.pageSize || 10;

            actions.TrainSaleOrder.loadList(values);
        });

        
    }
    /**
     * 重置
     */
    reset = () => {
        this.setState({
            organization:'',
            orderNumber:'',
            orderDate:'',
            distributionChannel:'',
            deliveryDate:'',
            client:'',
            orderAmount:'',
            salesman:'',
            remark:'',
        })
    }
    render(){
        const { getFieldProps, getFieldError } = this.props.form;
        let { orderTypes } = this.props;
        let _this = this;
        return (
            <SearchPanel 
                className='TrainSaleOrder-form' 
                form={this.props.form} 
                reset={this.reset} 
                search={this.search}>
                <Row>

		            <Col md={4} xs={6}>
                        <FormItem>
                            <Label>ORGANIZATION</Label>
                            <FormControl
                                {
                                    ...getFieldProps('organization', {
                                        initialValue: '',
                                    })
                                }
                            />
                        </FormItem>
                    </Col>
		            <Col md={4} xs={6}>
                        <FormItem>
                            <Label>ORDERNUMBER</Label>
                            <FormControl
                                {
                                    ...getFieldProps('orderNumber', {
                                        initialValue: '',
                                    })
                                }
                            />
                        </FormItem>
                    </Col>
		            <Col md={4} xs={6}>
                        <FormItem>
                            <Label>ORDERDATE</Label>
                            <RangePicker
                            defaultValue={this.state.orderDate}
                            placeholder={'开始 ~ 结束'}
                            dateInputPlaceholder={['开始', '结束']}
                            {
                                ...getFieldProps('orderDate', {
                                    initialValue:'',
                                    onChange:  (v)=> {
                                        this.setState({
                                            orderDate: v
                                        })
                                    }
                                })
                            }
                            />
                        </FormItem>
                    </Col>
		            <Col md={4} xs={6}>
                        <FormItem>
                            <Label>DISTRIBUTIONCHANNEL</Label>
                            <Select
                            {
                                ...getFieldProps('distributionChannel', {
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
                            <Label>DELIVERYDATE</Label>
                            <RangePicker
                            defaultValue={this.state.deliveryDate}
                            placeholder={'开始 ~ 结束'}
                            dateInputPlaceholder={['开始', '结束']}
                            {
                                ...getFieldProps('deliveryDate', {
                                    initialValue:'',
                                    onChange:  (v)=> {
                                        this.setState({
                                            deliveryDate: v
                                        })
                                    }
                                })
                            }
                            />
                        </FormItem>
                    </Col>
		            <Col md={4} xs={6}>
                        <FormItem>
                            <Label>CLIENT</Label>
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
                            <Label>ORDERAMOUNT</Label>
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
                            <Label>SALESMAN</Label>
                            <FormControl
                                {
                                    ...getFieldProps('salesman', {
                                        initialValue: '',
                                    })
                                }
                            />
                        </FormItem>
                    </Col>
		            <Col md={4} xs={6}>
                        <FormItem>
                            <Label>REMARK</Label>
                            <FormControl
                                {
                                    ...getFieldProps('remark', {
                                        initialValue: '',
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

export default Form.createForm()(TrainSaleOrderForm)