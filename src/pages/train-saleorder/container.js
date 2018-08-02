import React from 'react';
import mirror, { connect } from 'mirrorx';

// 组件引入
import TrainSaleOrderTable from './components/TrainSaleOrder-root/TrainSaleOrderTable';
import TrainSaleOrderSelectTable from './components/TrainSaleOrder-root/TrainSaleOrderSelectTable';
import TrainSaleOrderPaginationTable from './components/TrainSaleOrder-root/TrainSaleOrderPaginationTable';
import TrainSaleOrderEdit from './components/TrainSaleOrder-edit/Edit';
import TrainSaleOrderBpmChart from './components/TrainSaleOrder-bpm-chart'
    import TrainSaleOrderSubChildtable from './components/TrainSaleOrderSub-childtable'
// 数据模型引入
import model from './model'
mirror.model(model);

// 数据和组件UI关联、绑定
export const ConnectedTrainSaleOrderTable = connect( state => state.TrainSaleOrder, null )(TrainSaleOrderTable);
export const ConnectedTrainSaleOrderSelectTable = connect( state => state.TrainSaleOrder, null )(TrainSaleOrderSelectTable);
export const ConnectedTrainSaleOrderPaginationTable = connect( state => state.TrainSaleOrder, null )(TrainSaleOrderPaginationTable);
export const ConnectedTrainSaleOrderEdit = connect( state => state.TrainSaleOrder, null )(TrainSaleOrderEdit);
export const ConnectedTrainSaleOrderBpmChart = connect( state => state.TrainSaleOrder, null )(TrainSaleOrderBpmChart);
export const ConnectedTrainSaleOrderSubChildtable  = connect( state => state.TrainSaleOrder, null )(TrainSaleOrderSubChildtable);
