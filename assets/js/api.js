axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {

    const token = localStorage.getItem('token') || ''
    if (config.url.startsWith('/my')) {
        config.headers.Authorization = token
    }
    // 在发送请求之前做些什么
    return config;

}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    console.log('接收 ajax 响应前', response);
    const { message, status } = response.data
    // 判断身份验证是否成功
    if (message == '身份认证失败！' && status == 1) {
        // 清除本地存储
        localStorage.removeItem('token')
        // 跳转页面
        location.href = './login.html'
    }
    // 对响应数据做点什么
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});