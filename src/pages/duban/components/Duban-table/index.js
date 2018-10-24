import React, { Component } from 'react'
import { actions } from "mirrorx";
import { Table,Button } from 'tinper-bee'
import moment from "moment/moment";
import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl';
import './index.less'

// DubanTable 组件定义
class DubanTable extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    /**
     * 编辑,详情，增加
     */
    cellClick = async(record, editFlag) => {

        // 新增、编辑、查看时,先清空子表数据
        await actions.mastertable.updateState({
            childListDubanSub:[],
            cacheArrayDubanSub:[],
        })

        actions.routing.push(
            {
                pathname: 'Duban-edit',
                detailObj: record,
                editFlag: !!editFlag
            }
        )
    }
    delItem = (record, index) => {
        actions.Duban.delItem({
            param: [{ id: record.id,ts: record.ts }],
            index: index
        });
    }
    /**
     *
     */
    render(){
        const self = this;
        const column = [
            {
                title: "序号",
                dataIndex: "index",
                key: "index",
                width: 80,
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
                    title: "责任人",
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
                    title: "责任单位",
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
                    title: "协办人",
                    dataIndex: "xbrName",
                    key: "xbrName",
                    width: 100,
                },
                {
                    title: "协办单位",
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
                    title: "主办人",
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
                    title: "所属组织",
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
                            <Button size='sm' className='edit-btn' onClick={() => { self.cellClick(record, true) }}>编辑</Button>
                            <Button size='sm' className='del-btn' onClick={() => { self.delItem(record, index) }}>删除</Button>
                        </div>
                    )
                }
            }
        ];
        const { list,showLoading,pageSize, pageIndex, totalPages, } = this.props;
        return (
            <div className="table-list">
                <div className='table-header'>
                    <Button
                        size="sm"
                        colors="primary"
                        shape="border"
                        onClick={() => { self.cellClick({}, true) }}>
                        <FormattedMessage
                            id="intl.duban.button.create"
                        />
                    </Button>
                </div>
                <Table
                    loading={{show:showLoading,loadingType:"line"}}
                    rowKey={(r,i)=>i}
                    columns={column}
                    data={list}
                />
            </div>
        )
    }
}

export default DubanTable