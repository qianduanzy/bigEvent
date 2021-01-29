$(function () {
    // 点击切换登录注册
    $('.link a').on('click', function () {
        $('.layui-form').toggle()
    })
    // 解构赋值
    const { form, layer } = layui
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 注册表单确认密码
        samePass: function (value) {
            if (value !== $('#pass').val()) return '两次密码输入不一致'
        }
    })

    // 注册
    $('.reg-form').on('submit', function (e) {
        e.preventDefault()
        // 发送 ajax 请求
        axios.post('/api/reguser', $(this).serialize())
            .then(res => {
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg('注册失败')
                }
                layer.msg('注册成功')
                // 自动触发点击事件
                $('.login-form a').click()
            })
    })

    // 登录
    $('.login-form').on('submit', function (e) {
        e.preventDefault()
        axios.post('/api/login', $(this).serialize())
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                localStorage.setItem('token', res.token)
                layer.msg('登录成功')
                location.href = './index.html'
            })
    })
})