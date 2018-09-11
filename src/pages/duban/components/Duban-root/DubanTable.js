import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";

import Header from 'components/Header';
import DubanTable from '../Duban-table';
import DubanForm from '../Duban-form';

import './index.less';

/**
 * DubanRoot Component
 */
class DubanRoot  extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }
    /**
     *
     */
    componentWillMount() {
        this.getTableData();
    }
    /**
     * 获取table表格数据
     */
    getTableData = () => {
        actions.Duban.loadList();
    }

    render() {
        let { pageSize, pageIndex, totalPages} = this.props;
        return (
            <div className='Duban-root'>
                <Header title='平台-督办任务主表' back={true}/>
                <DubanForm { ...this.props }/>
                <DubanTable { ...this.props }/>
            </div>
        )
    }
}
export default DubanRoot;