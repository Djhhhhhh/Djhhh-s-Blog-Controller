import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useTokenStore } from '../stores/token';
const instance = axios.create({
    baseURL: "/api",
    timeout:5000
})


instance.interceptors.request.use(
    (config)=>{
        const tokenStore=useTokenStore()
        if(tokenStore.token){
            config.headers.Authorization=tokenStore.token
        }
        return config
    },
    (error)=>{
        Promise.reject(err);
    }
)
import router from '../router';
//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        if(result.data.code === 0){
            return result.data;
        }
        ElMessage.error(result.data.message?result.data.message:"服务异常")
        return Promise.reject(result.data)
    },
    err=>{
        if (err.response) {
            switch (err.response.status) {
                case 401:
                    ElMessage.error("请先登录");
                    router.push('/login');
                    break;
                case 404:
                    ElMessage.error("请求的资源不存在");
                    break;
                default:
                    ElMessage.error('服务异常');
                    router.push('/login');
            }
        } else if (err.request) {
            ElMessage.error('请求超时，请稍后再试');
        } else {
            ElMessage.error('请求发送失败');
        }
        return Promise.reject(err);
    }
)

export default instance;