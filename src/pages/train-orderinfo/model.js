import { actions } from "mirrorx";
// 引入services，如不需要接口请求可不写
import * as api from "./service";
// 接口返回数据公共处理方法，根据具体需要
import { processData } from "utils";
import moment from 'moment';

/**
 *          btnFlag为按钮状态，新增、修改是可编辑，查看详情不可编辑，
 *          新增表格为空
 *          修改需要将行数据带上并显示在卡片页面
 *          查看详情携带行数据但是表格不可编辑
 *          0表示新增、1表示编辑，2表示查看详情 3提交
 *async loadList(param, getState) {
 *          rowData为行数据
*/

export default {
    // 确定 Store 中的数据模型作用域
    name: "OrderInfo",
    // 设置当前 Model 所需的初始化 state
    initialState: {
        rowData:{},
        showLoading:false,
        list: [],
        orderTypes:[],
        pageIndex:1,
        pageSize:10,
        totalPages:1,
        detail:{},
        searchParam:{},
        validateNum:99,//不存在的step

    },
    reducers: {
        /**
         * 纯函数，相当于 Redux 中的 Reducer，只负责对数据的更新。
         * @param {*} state
         * @param {*} data
         */
        updateState(state, data) { //更新state
            return {
                ...state,
                ...data
            };
        }
    },
    effects: {
        /**
         * 加载列表数据
         * @param {*} param
         * @param {*} getState
         */
        async loadList(param, getState) {
            // 正在加载数据，显示加载 Loading 图标
            actions.OrderInfo.updateState({ showLoading:true })
            if(param){
                param.pageIndex = param.pageIndex ? param.pageIndex - 1 : 0;
                param.pageSize = param.pageSize ? param.pageSize : 10;
            } else {
                param = {}
            }
            // 调用 getList 请求数据
            let res = processData(await api.getList(param));
            actions.OrderInfo.updateState({  showLoading:false })
            if (res) {
                if(res.content&&res.content.length){
                    for(let i=0;i<res.content.length;i++){
                        let temp = Object.assign({},res.content[i]);
                        res.content[i].key=i+1;
                        res.content[i].orderNo = temp.orderNo+"";
                        res.content[i].purOrg = temp.purOrg+"";
                        res.content[i].applyNo = temp.applyNo+"";
                        res.content[i].purGroupNo = temp.purGroupNo+"";
                        res.content[i].releaseTime = temp.releaseTime+"";
                        res.content[i].confirmTime = temp.confirmTime+"";
                        res.content[i].orderType = temp.orderType+"";
                        res.content[i].orderState = temp.orderState+"";
                        res.content[i].orderAmount = temp.orderAmount+"";
                        res.content[i].isPaid = temp.isPaid+"";
                    }
                }
                // console.log('res content',res.content);
                actions.OrderInfo.updateState({
                    list: res.content,
                    pageIndex:res.number + 1,
                    totalPages:res.totalPages,
                });
            }
        },

        /**
         * getSelect：获取下拉列表数据
         * @param {*} param
         * @param {*} getState
         */
        getOrderTypes(param,getState){
            actions.OrderInfo.updateState({
            orderTypes:  [{
                "code":"0",
                "name":"D001"
            },{
                "code":"1",
                "name":"D002"
            },{
                "code":"2",
                "name":"D003"
            },{
                "code":"3",
                "name":"D004"
            }]
            })
        },

        /**
         * getSelect：保存table数据
         * @param {*} param
         * @param {*} getState
         */
        async saveList(param, getState) {
            let result = await api.saveList(param);
            return result;
        },
        /**
         * 删除table数据
         * @param {*} id
         * @param {*} getState
         */
        async removeList(id, getState) {
            let result = await api.deleteList([{id}]);
            return result;
        },

        async delItem(param,getState){
            actions.OrderInfo.updateState({
              showLoading:true
            })
            let res=processData(await api.delOrderInfo(param.param),'删除成功');
            actions.OrderInfo.loadList();
        },

        async save(param,getState){//保存
            actions.OrderInfo.updateState({
              showLoading:true
            })
            let res=await api.saveOrderInfo(param);
            console.log("保存信息",res);
            if(res){
               window.history.go(-1);
            }
            actions.OrderInfo.updateState({
                showLoading:false,

            });
        },

        async queryDetail(param,getState) {
            let {data:{detailMsg:{data:{content}}}}=await api.getDetail(param);
            return content[0];
        }
    }
};