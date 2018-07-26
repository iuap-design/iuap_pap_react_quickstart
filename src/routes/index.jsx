/**
 * 前端路由说明：
 * 1、基于浏览器 History 的前端 Hash 路由
 * 2、按业务模块和具体页面功能划分了一级路由和二级路由
 */
import React, { Component } from "react";
import { Route } from "mirrorx";


// 典型案例与应用组件示例
// import templates from 'modules/templates/router';


import "./index.less";

export default class App extends Component {
  render(){
    return (
      <div className="route-content">
         {/* 添加路由入口
            <Route path="/" exact={true} component={templates}
            <Route path="/templates" component={templates} />
         */}
      </div>
    )
  }
}

