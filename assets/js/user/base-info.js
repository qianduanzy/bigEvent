$(function () {
    const { layer, form } = layui
    function userInfo() {
        axios.get('/my/userinfo')
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('获取失败');
                }
                const { data } = res
                console.log(res.data);
                form.val('edit-userinfo', data)
            })
    }
    userInfo()

    // 表单验证
    form.verify({
        nick: [
            /^\w{1,6}$/,
            '昵称长度必须在 1 ~ 6 个字符之间'
        ],

    })

    // 提交修改
    $('.baseform').on('submit', function (e) {
        e.preventDefault()
        axios.post('/my/userinfo', $(this).serialize())
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('修改信息失败!')
                }
                layer.msg('修改信息成功!')
                window.parent.getUserInfo()
            })
    })

    // 重置功能
    $('#reset-btn').on('click', function (e) {
        e.preventDefault()
        userInfo()
    })
})