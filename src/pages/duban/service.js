import request from "utils/request";

//定义接口地址
const URL = {
    "GET_DETAIL":  `${GROBAL_HTTP_CTX}/DUBAN/getAssoVo`,
    "SAVE_ORDER":  `${GROBAL_HTTP_CTX}/DUBAN/saveAssoVo`,
    "GET_LIST":  `${GROBAL_HTTP_CTX}/DUBAN/list`,
    "DEL_ORDER":  `${GROBAL_HTTP_CTX}/DUBAN/deleteBatch`,
    // 打印
    "GET_QUERYPRINTTEMPLATEALLOCATE":  `/eiap-plus/appResAllocate/queryPrintTemplateAllocate`,
    "PRINTSERVER": '/print_service/print/preview',

    "GET_TOEXPORTEXCEL":  `${GROBAL_HTTP_CTX}/DUBAN/toExportExcel`,
}

/**
 * 获取列表
 * @param {*} params
 */
export const getList = (params) => {
    let url =URL.GET_LIST+'?1=1';
    for(let attr in params){
        if((attr!='pageIndex')&&(attr!='pageSize')){
            url+='&search_'+attr+'='+params[attr];
        }else{
            url+='&'+attr+'='+params[attr];
        }
    }
    return request(url, {
        method: "get",
        data: params
    });
}

/**
 * 获取下拉列表
 * @param {*} params
 */
export const getSelect = (params) => {
    return request(URL.GET_SELECT, {
        method: "get",
        data: params
    });
}
/**
 * 删除table数据
 * @param {*} params
 */
export const deleteList = (params) => {
    return request(URL.DELETE, {
        method: "post",
        data:params
    });
}

export const saveList = (params) => {
    return request(URL.SAVE, {
        method: "post",
        data:params
    });
}
export const saveDuban = (params) => {
    return request(URL.SAVE_ORDER, {
        method: "post",
        data: params
    });
}
export const delDuban = (params) => {
    return request(URL.DEL_ORDER, {
        method: "post",
        data: params
    });
}

/**
 * 通过search_id 查询列表详情
*/

export const getDetail = (params) => {
    return request(URL.GET_DETAIL, {
        method: "get",
        param: params
    });
}
// 打印

export const queryPrintTemplateAllocate = (params) => {
    return request(URL.GET_QUERYPRINTTEMPLATEALLOCATE, {
        method: "get",
        param: params
    });    
    
}

export const printExcel = (params) => {

    let search = [];
    for(let key in params){
        search.push(`${key}=${params[key]}`)
    }
    let exportUrl = `${URL.PRINTSERVER}?${search.join('&')}`;
    console.log(exportUrl);
    window.open(exportUrl);     
    
}
/**
 * 导出
 */
export const exportExcel = (params) => {

    let search = [];
    for(let key in params){
        search.push(`${key}=${params[key]}`)
    }
    let exportUrl = `${URL.GET_TOEXPORTEXCEL}?${search.join('&')}`;
    console.log(exportUrl);
    window.open(exportUrl);     
    
}
