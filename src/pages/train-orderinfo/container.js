import React from 'react';
import mirror, { connect } from 'mirrorx';

// 组件引入
import OrderInfoTable from './components/OrderInfo-root/OrderInfoTable';
import OrderInfoSelectTable from './components/OrderInfo-root/OrderInfoSelectTable';
import OrderInfoPaginationTable from './components/OrderInfo-root/OrderInfoPaginationTable';
import OrderInfoEdit from './components/OrderInfo-edit/Edit';
import OrderInfoBpmChart from './components/OrderInfo-bpm-chart'
// 数据模型引入
import model from './model'
mirror.model(model);

// 数据和组件UI关联、绑定
export const ConnectedOrderInfoTable = connect( state => state.OrderInfo, null )(OrderInfoTable);
export const ConnectedOrderInfoSelectTable = connect( state => state.OrderInfo, null )(OrderInfoSelectTable);
export const ConnectedOrderInfoPaginationTable = connect( state => state.OrderInfo, null )(OrderInfoPaginationTable);
export const ConnectedOrderInfoEdit = connect( state => state.OrderInfo, null )(OrderInfoEdit);
export const ConnectedOrderInfoBpmChart = connect( state => state.OrderInfo, null )(OrderInfoBpmChart);
