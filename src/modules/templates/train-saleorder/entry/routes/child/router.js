import React from 'react'
import { Route } from 'mirrorx'

// 导入节点

import {
    ConnectedTrainSaleOrderPaginationTable,
    ConnectedTrainSaleOrderEdit,
    ConnectedTrainSaleOrderBpmChart
} from '../../../container'



/**
 * 路由说明：
 * 1、单表【search-table】：
 *      simple-table：form+最简单表格
 *      pagination-table：form+综合表格功能
 * 6、参照功能示例【ref-exmaple】：
 * 7、新节点主子表【master-table】
 */
export default ({ match }) => (
    <div className="templates-route">

        {/*配置根路由记载节点*/}
        {<Route exact path={'/'} component={ConnectedTrainSaleOrderPaginationTable} />}

        {/*配置节点路由*/}
        <Route  path={`${match.url}TrainSaleOrder-table`} component={ConnectedTrainSaleOrderPaginationTable} />
        <Route  path={`${match.url}TrainSaleOrder-edit`} component={ConnectedTrainSaleOrderEdit} />
        <Route  path={`${match.url}TrainSaleOrder-chart`} component={ConnectedTrainSaleOrderBpmChart} />

    </div>
)