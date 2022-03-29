import axios from 'axios'
import {message} from 'antd'
import type { AxiosRequestConfig, AxiosInstance, AxiosRequestHeaders } from 'axios'
interface AxiosConfig extends AxiosRequestConfig {
  credentials?: string
  headers?: AxiosRequestHeaders | any
}
// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
// axios.defaults.headers.post['Access-Control-Allow-Credentials'] = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// 增加ie兼容，防止get接口被缓存
// axios.defaults.headers.common['Pragma'] = 'no-cache'
// axios.defaults.headers.common['Cache-Control'] = 'no-cache'
//设置axios拦截器
let config:AxiosConfig = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  credentials: 'same-origin',
  headers: {
    authorization: ""
  }
  // withCredentials: true, // Check cross-site Access-Control
}

const _axios:AxiosInstance = axios.create(config)
_axios.interceptors.request.use((config:AxiosConfig) => {
  //在utils/request里面配置了请求头
  const tag_id:string|null = localStorage.getItem('tag_id')
  if (tag_id) {
    config.headers.authorization = `Bearer ${tag_id}`;
  }
  return config
})
_axios.interceptors.response.use(
  (response:any) => {
    const { status, data, msg } = response
    if (status === 200 && data.code === 200) {
      return data
    } else if(status === 200 && data.code === 401) {
      message.error(data.msg)
      setTimeout(() => {
        window.location.href = `${window.location.origin}/login`
      },2000)
    } else {
      message.error(data.msg || msg); 
    }
  },
  error => {
    return Promise.reject(error)
  }
)
export default _axios;
