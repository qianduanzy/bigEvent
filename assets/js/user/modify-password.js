$(function () {
    const { form, layer } = layui
    // 表单校验
    form.verify({
        pass: [
            /^\w{6,12}$/,
            '密码必须是6到12位，且不能出现空格'
        ],
        confirmPass: function (val) {
            if (val !== $('#pass').val()) {
                return '两次密码输入不一致'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        axios.post('/my/updatepwd', $(this).serialize())
            .then(res => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('修改密码失败')
                }
                else {
                    layer.msg('修改密码成功')
                    // 清除 token 
                    localStorage.removeItem('token')
                    // 跳转登录页面
                    window.parent.location.href = '../../../login.html'
                }
            })
    })
})