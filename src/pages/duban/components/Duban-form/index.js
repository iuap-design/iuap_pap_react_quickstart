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

class DubanForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            code: '',
            endDate: '',
            zrrName: '',
            refKeyArrayxbr:"",
            refKeyArrayzbr:"",
            rwpf: '',
            lyCode: '',
            qtLd: '',
            refKeyArrayzrDw:"",
            jdBl: '',
            zrdwName: '',
            state: '',
            dbInfo: '',
            xbrName: '',
            xbDwName: '',
            kpiLevel: '',
            jfyq: '',
            refKeyArrayxbDw:"",
            zbrName: '',
            beginDate: '',
            kpiFlag: '',
            unitIdName: '',
            lySm: '',
            dbr: '',
            name: '',
            refKeyArrayunitid:"",
            zyCd: '',
            refKeyArrayzrr:"",
        }
    }
    componentWillMount(){
        // 获得平台-督办任务主表列表数据
        actions.Duban.getOrderTypes();
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
                refKeyArrayxbr,
                refKeyArrayzbr,
                refKeyArrayzrDw,
                refKeyArrayxbDw,
                refKeyArrayunitid,
                refKeyArrayzrr,
            } = this.state;
            if(refKeyArrayxbr){
                values.xbr = refKeyArrayxbr
            }else {
                values.xbr = "";
            }
            if(refKeyArrayzbr){
                values.zbr = refKeyArrayzbr
            }else {
                values.zbr = "";
            }
            let rwpf = values.rwpf;
            if(rwpf){
                if(Number(rwpf)>0){
                values.rwpf = Number(rwpf);
                }else {
                delete values.rwpf 
                }
            }
            if(refKeyArrayzrDw){
                values.zrDw = refKeyArrayzrDw
            }else {
                values.zrDw = "";
            }
            let jdBl = values.jdBl;
            if(jdBl){
                if(Number(jdBl)>0){
                values.jdBl = Number(jdBl);
                }else {
                delete values.jdBl 
                }
            }
            if(refKeyArrayxbDw){
                values.xbDw = refKeyArrayxbDw
            }else {
                values.xbDw = "";
            }
            if(refKeyArrayunitid){
                values.unitid = refKeyArrayunitid
            }else {
                values.unitid = "";
            }
            if(refKeyArrayzrr){
                values.zrr = refKeyArrayzrr
            }else {
                values.zrr = "";
            }
            await actions.Duban.loadList(values);
        });


    }
    /**
     * 重置
     */
    reset = () => {
        this.setState({
    code:'',
    endDate:'',
    zrrName:'',
    xbr:'',
    zbr:'',
    rwpf:'',
    lyCode:'',
    qtLd:'',
    zrDw:'',
    jdBl:'',
    zrdwName:'',
    state:'',
    dbInfo:'',
    xbrName:'',
    xbDwName:'',
    kpiLevel:'',
    jfyq:'',
    xbDw:'',
    zbrName:'',
    beginDate:'',
    kpiFlag:'',
    unitIdName:'',
    lySm:'',
    dbr:'',
    name:'',
    unitid:'',
    zyCd:'',
    zrr:'',
        })
    }
    render(){
        const { getFieldProps, getFieldError } = this.props.form;
        let { orderTypes } = this.props;
        let self = this;
        let {
            refKeyArrayxbr,
            refKeyArrayzbr,
            refKeyArrayzrDw,
            refKeyArrayxbDw,
            refKeyArrayunitid,
            refKeyArrayzrr,
        } = this.state;
        return (
            <SearchPanel
                    className='Duban-form'
                    form={this.props.form}
                    reset={this.reset}
                    search={this.search}>
                <Row>

                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>协办人</Label>
                                    <RefWithInput option={options({
                                                  title: '协办人',
                                        refType: 2,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'common_ref_table',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '2',
                                        },
                                        keyList:(refKeyArrayxbr && refKeyArrayxbr.split(',')) || [],//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayxbr: temp.join(),
                                            })
                                        },
                                        showKey:'peoname',
                                        verification:true,//是否进行校验
                                        verKey:'xbr',//校验字段
                                        verVal:""
                                    })} form={this.props.form}/>
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>牵头领导</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('qtLd', {
                                                initialValue: '',
                                            })
                                        }
                                    />
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>督办事宜</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('dbInfo', {
                                                initialValue: '',
                                            })
                                        }
                                    />
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>交付要求</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('jfyq', {
                                                initialValue: '',
                                            })
                                        }
                                    />
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>督办人</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('dbr', {
                                                initialValue: '',
                                            })
                                        }
                                    />
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>督办名称</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('name', {
                                                initialValue: '',
                                            })
                                        }
                                    />
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>所属组织</Label>
                                    <RefWithInput option={options({
                                                  title: '所属组织',
                                        refType: 3,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'common_ref_treecard',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '3',
                                        },
                                        keyList:(refKeyArrayunitid && refKeyArrayunitid.split(',')) || [],//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayunitid: temp.join(),
                                            })
                                        },
                                        showKey:'peoname',
                                        verification:true,//是否进行校验
                                        verKey:'unitid',//校验字段
                                        verVal:""
                                    })} form={this.props.form}/>
                                </FormItem>
                            </Col>
                </Row>
            </SearchPanel>
        )
    }
}

export default Form.createForm()(DubanForm)