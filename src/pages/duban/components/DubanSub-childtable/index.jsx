import React, { Component } from 'react';
import { actions ,connect } from "mirrorx";
import queryString from 'query-string';
import PaginationTable from 'components/PaginationTable';
import options from "components/RefOption";
import RefWithInput from 'yyuap-ref/dist2/refWithInput';
import Form from 'bee-form';
import { 
    InputNumber, InputGroup,FormControl, 
    Loading, 
    Table, 
    Button, 
    Row,Col, 
    Icon, 
    Checkbox, Modal, 
    Panel, PanelGroup, 
    Label, 
    Message, 
    Radio,
    Pagination
} from "tinper-bee";

import Select from 'bee-select';
import DatePicker from 'bee-datepicker';
import moment from "moment";
import zhCN from "rc-calendar/lib/locale/zh_CN";
import NoData from 'components/NoData';

import "bee-datepicker/build/DatePicker.css";
import './index.less'

moment.locale('zh-cn');

const format = "YYYY-MM-DD HH:mm:ss";
const Option = Select.Option;

let id = 0;
class ChildTable extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            selectData:[],
            editFlag:true,
            
        };
        let {btnFlag} = this.props;
        this.editFlag = btnFlag ? btnFlag<2 : true;
        // console.log("editFlag",this.editFlag);
        
        this.column = [
            {
                title: "计划开始时间",
                dataIndex: "beginDate",
                key: "beginDate",
                width: 150,
                render: (text, record, index) => this.
                
                
                
                
                renderDatePicker
                
                (text, record, index, "beginDate",this.editFlag)
            },
            {
                title: "结束时间",
                dataIndex: "endDate",
                key: "endDate",
                width: 150,
                render: (text, record, index) => this.
                
                
                
                
                renderDatePicker
                
                (text, record, index, "endDate",this.editFlag)
            },
            {
                title: "编码",
                dataIndex: "subCode",
                key: "subCode",
                width: 150,
                render: (text, record, index) => this.
                
                
                
                
                
                renderRefcommon_ref
                (text, record, index, "subCode",this.editFlag)
            },
            {
                title: "名称",
                dataIndex: "name",
                key: "name",
                width: 150,
                render: (text, record, index) => this.
                renderColumns
                
                
                
                
                
                (text, record, index, "name",this.editFlag)
            },
            {
                title: "责任人",
                dataIndex: "zbr",
                key: "zbr",
                width: 150,
                render: (text, record, index) => this.
                
                
                
                
                
                renderRefbd_common_user
                (text, record, index, "zbr",this.editFlag)
            },
            {
                title: "子任务描述",
                dataIndex: "subMs",
                key: "subMs",
                width: 150,
                render: (text, record, index) => this.
                renderColumns
                
                
                
                
                
                (text, record, index, "subMs",this.editFlag)
            },
            {
                title: "操作",
                dataIndex: "d",
                key: "d",
                width: 100,
                render:(text, record, index)=> {
                    return  (
                        
                        <div className='operation-btn'>
                            {
                                this.editFlag?<i size='sm' className='uf uf-del del-btn' onClick={() => { this.onChildDel(record, index) }}></i> :text
                            }
                        </div>
                    ) 
                        
                    
                }
            }]
            this.adjustColumn();
    }

    // 查看状态下删除操作列
    adjustColumn = () => {
        let self = this;
        if(!self.editFlag) {
            this.column.pop();
        }
    }

    // 普通编辑框渲染
    renderColumns = (text, record,index, column,editFlag) =>{
        return (
            <this.EditableCell
                editable={editFlag}
                value={text}
                onChange={value => this.handleChange(value, index, column)}
            />
        );
    }

    EditableCell = ({editable,value,onChange}) =>(
        <div>
            {editable
                ? <FormControl value={value} onChange={value => onChange(value)} />
                : value
            }
        </div>
    )

    handleChange = (value, index, column)=>{
        const newData = [...this.props.childListDubanSub];
        const target = newData.filter((item,newDataIndex) => index === newDataIndex)[0];
        // debugger
        if (target) {
            target[column] = value;
            actions.Duban.updateState({
                list: newData
            });
        }
    }

    //渲染整型数字列
    renderColumnsInt = (text, record,index, column,editFlag) => {
        return (
            <this.EditableCellInputNumber
                editable={editFlag}
                value={text}
                onChange={value => this.handleChangeNumber(value, index, column)}
            />
        );
    }

     //行编辑InputNumber
    EditableCellInputNumber = ({ editable, value,onChange }) => (
        <div>
            {editable
                ? <InputNumber
                    iconStyle="one"
                    max={9999}
                    min={0}
                    step={ 1}
                    value={parseInt(value)}
                    onChange={value => onChange(value)}
                />
                : value
            }
        </div>
    );

    handleChangeNumber = (value, index, column)=>{
        const newData = [...this.props.childListDubanSub];
        const target = newData.filter((item,newDataIndex) => index === newDataIndex)[0];
        if (target) {
            target[column] = parseInt(value);
            actions.Duban.updateState({
                list: newData
            });
        }
    }

    // 渲染浮点类型数字列
    renderColumnsFloat = (text, record,index, column,editFlag) => {
        return (
            <this.EditableCellFloat
                editable={editFlag}
                value={text}
                onChange={value => this.handleChangeFloat(value, index, column)}
            />
        );
    }

     //行编辑InputNumber
     EditableCellFloat = ({ editable, value,onChange }) => (
        <div>
            {editable
                ? <InputNumber
                    precision={2}
                    min={0}
                    step={ 1}
                    value={value}
                    onChange={value => onChange(value)}
                />
                : value
            }
        </div>
    );

    handleChangeFloat = (value, index, column)=>{
        const newData = [...this.props.childListDubanSub];
        const target = newData.filter((item,newDataIndex) => index === newDataIndex)[0];
        if (target) {
            target[column] = value;
            actions.Duban.updateState({
                list: newData
            });
        }
    }

    // 渲染时间列
    renderDatePicker = (text, record,index, column,editFlag) =>{
        return (
            <this.EditableCellDatePicker
                editable={editFlag}
                value={text}
                onChange={value => this.handleChangeDate(value, index, column)}
            />
        )
    }

    EditableCellDatePicker = ({ editable, value, onChange }) => (
        <div>
            {
                editable?(
                    <DatePicker
                        format={format}
                        locale={zhCN}
                        // onSelect={this.onSelect}
                        defaultValue={moment()}
                        onChange={value => onChange(value)}
                        value={moment(value)}
                    />
               ) 
               :moment(value).format(format)
            }
        </div>
    )

    handleChangeDate = (value, index, column)=> {
        // console.log("date",value.toISOString());
        const newData = [...this.props.childListDubanSub];
        const target = newData.filter((item,newDataIndex) => index === newDataIndex)[0];
        if (target) {
            target[column] = value.format(format);
            // console.log("newData date",newData)
            actions.Duban.updateState({
                list: newData
            });
        }
    }
    // 渲染参照
    renderRefcommon_ref = (text, record,index, column,editFlag) => {
        let self = this;
        // 处理参照的key值

        let cacheArray = [...this.props.cacheArrayDubanSub];
        let childRefKey =[],
            uuid = record.uuid;
        cacheArray.map((item)=>{
            let temp = item.uuid;
            if(temp && uuid && (temp ==uuid)){
                childRefKey = item[column]? item[column].split(','):[]
            }
        })
        
        return (
            <this.EditableCellRefcommon_ref
                editable={editFlag}
                value={text}
                index={index}
                self = {self}
                fieldKey = {column}
                record = {record}
                childRefKey = {childRefKey}
            />
        );
    }

    EditableCellRefcommon_ref = ({ editable, value ,index,self, fieldKey,record,childRefKey}) =>(
        <div>
            {
                editable?(
                    <RefWithInput disabled={false} option={options({
                        title: '我的参照组织',
                        
                        refType: 5,//1:树形 2.单表 3.树卡型 4.多选 5.default
                        
                        className: '',
                        param: {//url请求参数
                            refCode: 'common_ref',
                            tenantId: '',
                            sysId: '',
                            transmitParam: '5',
                        },
                        keyList: childRefKey||[],//选中的key
                        onSave: function (sels) {
                            const showData = sels.map(v => v.peoname)
                            var temp = sels.map(v => v.key)
                            const newData = [...self.props.childListDubanSub];
                            const target = newData.filter((item,newDataIndex) => record.uuid === item.uuid)[0];
                            if (target) {
                                let uuid = target['uuid'];
                                target[fieldKey+uuid] = temp.join();
                                actions.Duban.updateState({
                                    list: newData
                                });
                            }
                        },
                        showKey: 'peoname',
                        verification: true,//是否进行校验
                        verKey: `${record['uuid']}${fieldKey}`,//校验字段
                        verVal: value
                    })} form={this.props.form} />
               ) 
               :value
            }
        </div>
        
    )
    // 渲染参照
    renderRefbd_common_user = (text, record,index, column,editFlag) => {
        let self = this;
        // 处理参照的key值

        let cacheArray = [...this.props.cacheArrayDubanSub];
        let childRefKey =[],
            uuid = record.uuid;
        cacheArray.map((item)=>{
            let temp = item.uuid;
            if(temp && uuid && (temp ==uuid)){
                childRefKey = item[column]? item[column].split(','):[]
            }
        })
        
        return (
            <this.EditableCellRefbd_common_user
                editable={editFlag}
                value={text}
                index={index}
                self = {self}
                fieldKey = {column}
                record = {record}
                childRefKey = {childRefKey}
            />
        );
    }

    EditableCellRefbd_common_user = ({ editable, value ,index,self, fieldKey,record,childRefKey}) =>(
        <div>
            {
                editable?(
                    <RefWithInput disabled={false} option={options({
                        title: '我的参照组织',
                        
                        refType: 6,//1:树形 2.单表 3.树卡型 4.多选 5.default
                        
                        className: '',
                        param: {//url请求参数
                            refCode: 'bd_common_user',
                            tenantId: '',
                            sysId: '',
                            transmitParam: '6',
                        },
                        keyList: childRefKey||[],//选中的key
                        onSave: function (sels) {
                            const showData = sels.map(v => v.peoname)
                            var temp = sels.map(v => v.key)
                            const newData = [...self.props.childListDubanSub];
                            const target = newData.filter((item,newDataIndex) => record.uuid === item.uuid)[0];
                            if (target) {
                                let uuid = target['uuid'];
                                target[fieldKey+uuid] = temp.join();
                                actions.Duban.updateState({
                                    list: newData
                                });
                            }
                        },
                        showKey: 'name',
                        verification: true,//是否进行校验
                        verKey: `${record['uuid']}${fieldKey}`,//校验字段
                        verVal: value
                    })} form={this.props.form} />
               ) 
               :value
            }
        </div>
        
    )
    // 渲染下拉框
    renderSelect = (text, record,index, column,editFlag) => {
        return (
            <this.EditableCellSelect
                editable={editFlag}
                value={text}
                onSelect={value => this.handleTableSelect(value, index, column)}
            />
        );
    }

    EditableCellSelect = ({editable,value,onSelect}) =>(
        <div>
            {editable
                ? (
                    <Select
                        defaultValue = '0'
                        value = {value==1?value+'':'0'}
                        onSelect = {value=>onSelect(value)}
                        >
                        <Option value="0">未发货</Option>
                        <Option value="1">已发货</Option>
                    </Select>
                )
                : value
            }
        </div>
    )

    handleTableSelect = (value, index, column)=> {
        const newData = [...this.props.childListDubanSub];
        const target = newData.filter((item,newDataIndex) => index === newDataIndex)[0];
        if (target) {
            console.log("select data",value);
            target[column] = value;
            actions.Duban.updateState({
                list: newData
            });
        }
    }

    // 增加空行
    onAddEmptyRow = ()=>{
        let tempArray = [...this.props.childListDubanSub],
            emptyRow = {
                        beginDate:moment().format(format),                        endDate:moment().format(format),                        subCode:'',
                        name:'',
                        zbr:'',
                        subMs:'',
            };
            // UUID用于表示新增数据，在保存数据时需要删掉uuid字段
            // let uuid = this.guid();
            let uuid = setTimeout(function(){},1);
            emptyRow['uuid'] = uuid;
            tempArray.push(emptyRow);
            actions.Duban.updateState({childListDubanSub:tempArray})
    }

    // 产生uuid备用
    guid = ()=>{
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    // 子表删除
    onChildDel = async (record, index)=>{

        console.log("行删除",record,index);
        let childList = this.deepClone("childListDubanSub"),
            cacheArray = this.deepClone("cacheArrayDubanSub"),
            id = record['id'],
            uuid = record['uuid'],
            delArray = this.deepClone('delArrayDubanSub');
        
        let childLen = childList.length,
            cacheLen = cacheArray.length;

        if(uuid) {
            let tempIndex = 0;
            for(let i=0;i<childLen;i++) {
                let item = Object.assign([],childList[i]);
                let temp = item.uuid;
                if(temp && temp==uuid){
                    tempIndex = i;
                }
                
            }
            let delItem = childList[tempIndex];
            let delItemId = delItem.id;
            if(delItemId){
                delArray.push(Object.assign({},childList[tempIndex],{dr:1}));
            }
            childList.splice(tempIndex,1);
            console.log("delArray",delArray);
        }
        

        console.log("this.props.childListDubanSub",this.props.childListDubanSub);
        console.log("删除后",childList,cacheArray)
        
        await actions.Duban.updateState({
            childListDubanSub:childList,
            cacheArrayDubanSub:cacheArray,
            delArrayDubanSub:delArray
        })

    }

    deepClone = (param)=>{
        let array = [];
        this.props[param].map(item=>{
            let temp = Object.assign({},item);
            array.push(item);
        })
        return array;
    }

    render() {
        let childList = [...this.props.childListDubanSub];
        return (
            <div className="child-table">
                <div className="chidtable-operate-btn">
                    {this.editFlag ? <Button size='sm' colors="primary" onClick={this.onAddEmptyRow}>增行</Button> :"" }
                </div>
                <Row className='table-list'>
                    <Col md={12}>
                        <Table
                            loading={{ show: this.state.loading, loadingType: "line" }}
                            bordered
                            emptyText={() => <NoData />}
                            data={childList}
                            rowKey={r => r.id}
                            columns={this.column}
                            scroll={{ x: '100%', y: 520 }}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Form.createForm()(ChildTable);
