import React, { Component } from 'react';
import { Button,Checkbox,Table } from 'tinper-bee';
import moment from "moment/moment";
import multiSelect from "tinper-bee/lib/multiSelect.js";
import Header from 'components/Header';
import DubanForm from '../Duban-form';
const MultiSelectTable = multiSelect(Table, Checkbox);

export default class DubanSelectTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectData:[]
        }
    }
    /**
     * 编辑
     */
    edit = () =>{
        console.log('进入编辑');
    }
    /**
     * tabel选中数据
     * @param {*} data
     */
    tabelSelect = (data) => {
        this.setState({
            selectData: data
        })
    }
    render(){
        const self=this;
        const { list,showLoading,pageSize, pageIndex, totalPages } = this.props;
        const column = [
            {
                title: "序号",
                dataIndex: "index",
                key: "index",
                width: 100,
                render(record, text, index) {
                    return index + 1;
                }
            },
                {
                    title: "督办编号",
                    dataIndex: "code",
                    key: "code",
                    width: 100,
                },
                {
                    title: "计划结束时间",
                    dataIndex: "endDate",
                    key: "endDate",
                    width: 100,
                },
                {
                    title: "zrrName",
                    dataIndex: "zrrName",
                    key: "zrrName",
                    width: 100,
                },
                {
                    title: "协办人",
                    dataIndex: "xbr",
                    key: "xbr",
                    width: 100,
                },
                {
                    title: "主办人",
                    dataIndex: "zbr",
                    key: "zbr",
                    width: 100,
                },
                {
                    title: "任务评分",
                    dataIndex: "rwpf",
                    key: "rwpf",
                    width: 100,
                },
                {
                    title: "督办来源",
                    dataIndex: "lyCode",
                    key: "lyCode",
                    width: 100,
                },
                {
                    title: "牵头领导",
                    dataIndex: "qtLd",
                    key: "qtLd",
                    width: 100,
                },
                {
                    title: "责任单位",
                    dataIndex: "zrDw",
                    key: "zrDw",
                    width: 100,
                },
                {
                    title: "进度比例",
                    dataIndex: "jdBl",
                    key: "jdBl",
                    width: 100,
                },
                {
                    title: "zrdwName",
                    dataIndex: "zrdwName",
                    key: "zrdwName",
                    width: 100,
                },
                {
                    title: "状态",
                    dataIndex: "state",
                    key: "state",
                    width: 100,
                },
                {
                    title: "督办事宜",
                    dataIndex: "dbInfo",
                    key: "dbInfo",
                    width: 100,
                },
                {
                    title: "xbrName",
                    dataIndex: "xbrName",
                    key: "xbrName",
                    width: 100,
                },
                {
                    title: "xbDwName",
                    dataIndex: "xbDwName",
                    key: "xbDwName",
                    width: 100,
                },
                {
                    title: "kpi级别",
                    dataIndex: "kpiLevel",
                    key: "kpiLevel",
                    width: 100,
                },
                {
                    title: "交付要求",
                    dataIndex: "jfyq",
                    key: "jfyq",
                    width: 100,
                },
                {
                    title: "协办单位",
                    dataIndex: "xbDw",
                    key: "xbDw",
                    width: 100,
                },
                {
                    title: "zbrName",
                    dataIndex: "zbrName",
                    key: "zbrName",
                    width: 100,
                },
                {
                    title: "计划开始时间",
                    dataIndex: "beginDate",
                    key: "beginDate",
                    width: 100,
                },
                {
                    title: "是否kpi",
                    dataIndex: "kpiFlag",
                    key: "kpiFlag",
                    width: 100,
                },
                {
                    title: "unitIdName",
                    dataIndex: "unitIdName",
                    key: "unitIdName",
                    width: 100,
                },
                {
                    title: "备注",
                    dataIndex: "lySm",
                    key: "lySm",
                    width: 100,
                },
                {
                    title: "督办人",
                    dataIndex: "dbr",
                    key: "dbr",
                    width: 100,
                },
                {
                    title: "督办名称",
                    dataIndex: "name",
                    key: "name",
                    width: 100,
                },
                {
                    title: "所属组织",
                    dataIndex: "unitid",
                    key: "unitid",
                    width: 100,
                },
                {
                    title: "重要程度",
                    dataIndex: "zyCd",
                    key: "zyCd",
                    width: 100,
                },
                {
                    title: "责任人",
                    dataIndex: "zrr",
                    key: "zrr",
                    width: 100,
                },
            {
                title: "操作",
                dataIndex: "e",
                key: "e",
                render(text, record, index) {
                    return (
                        <div className='operation-btn'>
                            <Button size='sm' className='edit-btn' onClick={() => { self.edit(record,true) }}>编辑</Button>
                        </div>
                    )
                }
            }
        ];
        return (
            <div className="Duban-select-table">
                <Header title='平台-督办任务主表' back={true} />
                <DubanForm { ...this.props }/>
                <div className="table-list">
                    <MultiSelectTable
                        loading={{ show: showLoading, loadingType: "line" }}
                        rowKey={(r, i) => i}
                        columns={column}
                        data={list}
                        multiSelect={{ type: "checkbox" }}
                        getSelectedDataFunc={this.tabelSelect}
                    />
                </div>
            </div>
        )
    }
}