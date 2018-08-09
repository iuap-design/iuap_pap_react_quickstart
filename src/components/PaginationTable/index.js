import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Popover, Checkbox, Icon } from 'tinper-bee';
import Table from 'bee-table';
import PropTypes from 'prop-types';
import Pagination from 'bee-pagination';
import multiSelect from "bee-table/build/lib/newMultiSelect";
import filterColumn from "bee-table/build/lib/filterColumn";
import dragColumn from "bee-table/build/lib/dragColumn";

import 'bee-table/build/Table.css';
import 'bee-pagination/build/Pagination.css';
import './index.less'

// const DragColumnTable = dragColumn(multiSelect(Table, Checkbox));
const MultiSelectTable = multiSelect(Table, Checkbox);
// const DragColumnTable = filterColumn(dragColumn(multiSelect(Table, Checkbox)),Popover);

const propTypes = {
    // 表格行数据
    data: PropTypes.array.isRequired,
    // 显示是否展示 Loading 图标
    showLoading: PropTypes.bool.isRequired,
    // 表格当前展示多少行数据，默认为10
    pageSize: PropTypes.number,
    // 当前选中，对应activePage
    pageIndex: PropTypes.number.isRequired,
    // 总页数数量，默认为 5
    totalPages: PropTypes.number,
    // 定义表格列
    columns: PropTypes.array.isRequired,
    // 返回已选中的所有数据
    onTableSelectedData: PropTypes.func.isRequired,
    // 单页显示多少条，点击联动
    onPageSizeSelect: PropTypes.func.isRequired,
    // 页索引编号点击选中回调方法
    onPageIndexSelect: PropTypes.func.isRequired,
    // 横向或纵向滚动条设置
    scroll: PropTypes.object,
    // 表格标题
    title:PropTypes.func,
    // 表格尾部
    footer:PropTypes.func,
};

const defaultProps = {
    data: [],
    showLoading: false,
    pageSize: 10,
    pageIndex: 1,
    totalPages: 1,
    columns: [],
    onTableSelectedData: (value) => { },
    onPageSizeSelect: (value) => { },
    onPageIndexSelect: (value) => { }
};


const dataList = [
    {
        index: 1,
        orderCode:"2343",
        supplierName: "xxx",
        type_name: "123",
        purchasing:'内行',
        purchasingGroup:"323",
        voucherDate:"kkkk",
        approvalState_name:"vvvv",
        confirmState_name:"aaaa",
        closeState_name:"vnnnnn",
        d:"操作",
        key: "1"
    },
    {
      index: 2,
      orderCode:"222",
      supplierName: "22xxx",
      type_name: "1223",
      purchasing:'内行2',
      purchasingGroup:"3223",
      voucherDate:"222kk",
      approvalState_name:"22vvvv",
      confirmState_name:"2aaaa",
      closeState_name:"2vnnnnn",
      d:"2操作",
      key: "2"
  },
  ]
/**
 * PaginationTable 组件功能说明：
 * 1、默认支持表格多选
 * 2、表格默认自带分页组件
 */
class PaginationTable extends Component {
    constructor(props){
        super(props);
        this.state = { step: 10 }
    }
    componentWillMount(){
        this.setState({
            step: this.props.pageSize
        })
    }
    render(){
        const {
            data, showLoading, pageSize,
            pageIndex, totalPages, columns,checkMinSize,
            onTableSelectedData, onPageSizeSelect, onPageIndexSelect,
            scroll,title,footer,total,
        } = this.props;
        const step = this.state.step;
        let dataNumSelect = [step, step * 2, step * 3, step * 4];

        return (
            <div className="table-list">
                <MultiSelectTable
                    bordered
                    loading={{ show: showLoading, loadingType: "line" }}
                    rowKey={(r, i) => i}
                    columns={columns}
                    data={data}
                    multiSelect={{type: "checkbox"}}
                    getSelectedDataFunc={onTableSelectedData}
                    scroll={scroll}
                    title={title}
                    footer={footer}
                    checkMinSize={checkMinSize}
                />
                <div className='pagination'>
                    <Pagination
                        first
                        last
                        prev
                        next
                        boundaryLinks
                        items={totalPages}
                        activePage={pageIndex}
                        onDataNumSelect={onPageSizeSelect}
                        onSelect={onPageIndexSelect}
                        showJump={true}
                        dataNum={4}
                        maxButtons={5}
                        dataNumSelect={dataNumSelect}
                        total={total}
                    />
                </div>
            </div>
        )
    }
}

PaginationTable.propTypes = propTypes;
PaginationTable.defaultProps = defaultProps;

export default PaginationTable