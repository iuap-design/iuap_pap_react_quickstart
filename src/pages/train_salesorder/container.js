import React from 'react';
import mirror, { connect } from 'mirrorx';

// 组件引入
import TrainSalesorderTable from './components/TrainSalesorder-root/TrainSalesorderTable';
import TrainSalesorderSelectTable from './components/TrainSalesorder-root/TrainSalesorderSelectTable';
import TrainSalesorderPaginationTable from './components/TrainSalesorder-root/TrainSalesorderPaginationTable';
import TrainSalesorderEdit from './components/TrainSalesorder-edit/Edit';
import TrainSalesorderBpmChart from './components/TrainSalesorder-bpm-chart'
import TrainSalesorderSubChildtable from './components/TrainSalesorderSub-childtable'
// 数据模型引入
import model from './model'
mirror.model(model);

// 数据和组件UI关联、绑定
export const ConnectedTrainSalesorderTable = connect( state => state.TrainSalesorder, null )(TrainSalesorderTable);
export const ConnectedTrainSalesorderSelectTable = connect( state => state.TrainSalesorder, null )(TrainSalesorderSelectTable);
export const ConnectedTrainSalesorderPaginationTable = connect( state => state.TrainSalesorder, null )(TrainSalesorderPaginationTable);
export const ConnectedTrainSalesorderEdit = connect( state => state.TrainSalesorder, null )(TrainSalesorderEdit);
export const ConnectedTrainSalesorderBpmChart = connect( state => state.TrainSalesorder, null )(TrainSalesorderBpmChart);
export const ConnectedTrainSalesorderSubChildtable  = connect( state => state.TrainSalesorder, null )(TrainSalesorderSubChildtable);
