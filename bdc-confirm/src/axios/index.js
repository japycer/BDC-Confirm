
import axios from "axios";
import router from '../router'
import { Notification } from 'element-ui';
let config = {
    baseURL: 'http://127.0.0.1:3000/api',
    withCredentials: false, // 允许跨域
};

const _axios = axios.create(config);
// 超时时间20S
_axios.defaults.timeout = 20 * 1000;

//配置请求的参数
_axios.interceptors.request.use(config => {
    //配置token
    if (sessionStorage.getItem('token')) {
        config.headers['X-Auth-Token'] = sessionStorage.getItem('token');
    }
    return config;
}, error => {
    return Promise.reject(error);
})
//配置响应的参数
_axios.interceptors.response.use(response => {
    //当token过期或者不存在时，后台返回状态码401，此时页面跳转到登录页面
    if (response.status === 401) {
        router.push({ path: "/login" });
        Notification({
            message: "登录信息已过期,请重新登录",
            type: "error",
        });
        return;
    }
    return response

}, error => {
    return Promise.reject(error);
});

export default _axios
