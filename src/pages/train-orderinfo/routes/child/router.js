import React from 'react'
import { Route } from 'mirrorx'


// 导入节点

import {
    ConnectedOrderInfoPaginationTable,
    ConnectedOrderInfoEdit,
    ConnectedOrderInfoBpmChart
} from '../../container'



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

        <Route exact path={'/'} component={ConnectedOrderInfoPaginationTable} />

        {/*配置节点路由*/}
        <Route path={`${match.url}OrderInfo-table`} component={ConnectedOrderInfoPaginationTable} />
        <Route path={`${match.url}OrderInfo-edit`} component={ConnectedOrderInfoEdit} />
        <Route path={`${match.url}OrderInfo-chart`} component={ConnectedOrderInfoBpmChart} />

    </div>
)