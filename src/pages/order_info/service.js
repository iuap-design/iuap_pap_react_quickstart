import request from "utils/request";
import axios from "axios"; 

//定义接口地址
const URL = {
    "GET_DETAIL":  `${GROBAL_HTTP_CTX}/order_info/list`,
    "SAVE_ORDER":  `${GROBAL_HTTP_CTX}/order_info/save`,
    "GET_LIST":  `${GROBAL_HTTP_CTX}/order_info/list`,    
    "DEL_ORDER":  `${GROBAL_HTTP_CTX}/order_info/deleteBatch`,
    // 打印
    "GET_QUERYPRINTTEMPLATEALLOCATE":  `/eiap-plus/appResAllocate/queryPrintTemplateAllocate`,
    "PRINTSERVER": '/print_service/print/preview',

    "GET_TOEXPORTEXCEL":  `${GROBAL_HTTP_CTX}/order_info/toExportExcel`,
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
    url = encodeURI(url);
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
export const saveOrderInfo = (params) => {
    return request(URL.SAVE_ORDER, {
        method: "post",
        data: params
    });
}
export const delOrderInfo = (params) => {
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
    exportData(URL.GET_TOEXPORTEXCEL, params.dataList);
}

const selfURL = window[window.webkitURL ? 'webkitURL' : 'URL'];
let exportData = (url,data) => {
    axios({
        method : 'post',
        url : url,
        data : data,
        responseType : 'blob'
    }).then((res) => {
        const content = res.data;
        const blob = new Blob([content]);
        const fileName = "导出数据.xls";

        let elink = document.createElement('a');
        if('download' in elink) {
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = selfURL['createObjectURL'](blob);
            document.body.appendChild(elink);

            // 触发链接
            elink.click();
            selfURL.revokeObjectURL(elink.href);
            document.body.removeChild(elink)
        } else {
            navigator.msSaveBlob(blob, fileName);
        }
    })
}
