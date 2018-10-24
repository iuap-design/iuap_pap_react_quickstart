/**
 * 异步加载组件
 * @author luo35@sany.com.cn
 */
import React, {Component} from "react";
import mirror from "mirrorx";
import Loadable from "react-loadable";

/**
 * 找不到组件时显示的内容
 * @param path import的路径
 * @param namedExport
 * @returns {*}
 * @constructor
 */
const MissingComponent = ({path, namedExport}) => {
    return (
        <div>
            <p style={{color: 'red'}}>
                组件加载发生错误: 找不到相关组件<br/>
                {path}<br/>
                Named Export: [ {namedExport} ]<br/>
            </p>
        </div>
    )
};

/**
 * 组件加载中显示内容
 * @param props
 * @returns {*}
 * @constructor
 */
const Loading = (props) => {
    // console.log(props);
    if (props.error) {
        console.error("组件加载发生错误:" + props.error);
        return <div>Error! <button onClick={props.retry}>Retry</button></div>;
    } else if (props.timedOut) {
        console.error("组件加载发生错误: TimeOut");
        return <div>Taking a long time... <button onClick={props.retry}>Retry</button></div>;
    } else if (props.pastDelay) {
        return <div>Loading...</div>;
    } else {
        return null;
    }
};

/**
 * 异步加载组件, 封装了react-loadable方法.
 * 使用方式   const XXX = AsyncLoad(()=>import("./foo/baa"))
 * @param importComponent
 * @param namedExport
 * @returns {*}
 * @constructor
 */
const AsyncLoad = (importComponent, namedExport)=>{
    return Loadable({
        loader: importComponent,
        loading: Loading,
        render(loaded, props) {

            mirror.render();//参考https://github.com/mirrorjs/mirror/issues/93

            //如果未指定namedExport, 则使用默认值
            let Component = !!namedExport ? loaded[namedExport] : loaded.default;
            if (Component) {
                return <Component {...props}/>
            } else {
                console.error("组件加载发生错误: 找不到相关组件"
                    + "\n" + importComponent.toString()
                    + "\n namedExport : " + namedExport);
                return <MissingComponent
                    path={importComponent.toString()}
                    namedExport={namedExport}
                />
            }
        }
    });
};

export default AsyncLoad;