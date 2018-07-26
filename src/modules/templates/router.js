import React from 'react'
import { Route } from 'mirrorx'


// 导入节点
/*
import {
    ConnectedOrderInfoPaginationTable,
    ConnectedOrderInfoEdit,
    ConnectedOrderInfoBpmChart
} from './train-orderinfo/container'
*/


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
        {/*<Route exact path={`/`} component={ConnectedOrderInfoPaginationTable} />*/}


        {/*配置节点路由*/}
        {/*<Route exact path={`${match.url}/TrainSaleOrder-table`} component={ConnectedTrainSaleOrderPaginationTable} />*/}
        {/*<Route exact path={`${match.url}/TrainSaleOrder-edit`} component={ConnectedTrainSaleOrderEdit} />*/}
        {/*<Route exact path={`${match.url}/TrainSaleOrder-chart`} component={ConnectedTrainSaleOrderBpmChart} />*/}

    </div>
)