import ReactDOM from 'react-dom';
import { Message } from 'tinper-bee';


export const success = (msg) => {
    Message.create({ content: msg, color : 'success'  });
}

export const Error = (msg) => {
    Message.create({ content: msg, color : 'danger'  });
}

export const Warning = (msg) => {
    Message.create({ content: msg, color : 'warning' });
}
/**
 * 数据返回统一处理函数
 * @param {*} response 
 * @param {*} successMsg 成功提示
 */
export const processData = (response,successMsg) => {
    if(typeof response != 'object') {
        Error('数据返回出错：1、请确保服务运行正常；2、请确保您的前端工程代理服务正常；3、请确认您已在本地登录过应用平台');
        return;
    }
    
    if(response.status=='200'){
        let data=response.data;
        if(data.success=='success'){
            if(successMsg){
                success(successMsg);
            }
            return data.detailMsg.data;
        }else{
            Error(data.message||'数据返回出错');
            return;
        }
    }else{
        Error('请求错误');
        return;
    }
}

/**
 * param拼接到url地址上
 * @param {*} url 
 * @param {*} params
 * @param {*} prefix 
 */
export const paramToUrl = (url,params,prefix) =>{
    if(!prefix)prefix='';
    if(url.indexOf('?')==-1){
        url += '?r='+Math.random();
    }
    for(let attr in params){
        if((attr=='pageIndex')||(attr=='pageSize')){
            url+='&'+attr+'='+params[attr];
        }else{
            url+='&'+prefix+attr+'='+params[attr];
        }
    }
    return url;
}