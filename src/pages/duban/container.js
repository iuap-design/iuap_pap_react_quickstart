import React from 'react';
import mirror, { connect } from 'mirrorx';

// 组件引入
import DubanTable from './components/Duban-root/DubanTable';
import DubanSelectTable from './components/Duban-root/DubanSelectTable';
import DubanPaginationTable from './components/Duban-root/DubanPaginationTable';
import DubanEdit from './components/Duban-edit/Edit';
import DubanBpmChart from './components/Duban-bpm-chart'
    import DubanSubChildtable from './components/DubanSub-childtable'
// 数据模型引入
import model from './model'
mirror.model(model);

// 数据和组件UI关联、绑定
export const ConnectedDubanTable = connect( state => state.Duban, null )(DubanTable);
export const ConnectedDubanSelectTable = connect( state => state.Duban, null )(DubanSelectTable);
export const ConnectedDubanPaginationTable = connect( state => state.Duban, null )(DubanPaginationTable);
export const ConnectedDubanEdit = connect( state => state.Duban, null )(DubanEdit);
export const ConnectedDubanBpmChart = connect( state => state.Duban, null )(DubanBpmChart);
    export const ConnectedDubanSubChildtable  = connect( state => state.Duban, null )(DubanSubChildtable);
