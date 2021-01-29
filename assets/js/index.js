$(function () {
    const { layer } = layui
    function getUserInfo() {
        var token = localStorage.getItem('token') || ''
        axios.get('/my/userinfo')
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                const { data } = res
                // 获取用户名
                const name = data.nickname || data.username
                // 渲染用户名到页面
                $('.nickname').text(`欢迎 ${name}`).show()
                // 渲染头像
                if (data.user_pic) {
                    $('.avatar').prop('src', data.user_pic).show()
                    $('.text-avatar').hide()
                }
                else {
                    $('.avatar').hide()
                    $('.text-avatar').text(name[0].toUpperCase()).show()
                }
            })
    }
    getUserInfo()
    // 退出登录
    $('#logout').on('click', function () {
        // 清除本地存储
        localStorage.removeItem('token')
        // 跳转页面
        location.href = './login.html'
    })
})