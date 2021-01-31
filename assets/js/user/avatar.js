$(function () {
    const { layer } = layui
    // 1.1 获取裁剪区域的 元素对象
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 点击上传
    $('#upload-btn').on('click', function () {
        $('#file').click()
    })
    // 监听文件框改变时间
    $('#file').on('change', function () {
        console.log(this.files); // 用户上传的文件列表
        if (this.files.length == 0) {
            return layer.msg('请选择图片')
        }
        // 将文件转换为 url 地址形式
        var imgURL = URL.createObjectURL(this.files[0])
        console.log(imgURL);
        // 替换图片
        $image.cropper('replace', imgURL)

    })
    // 点击确定
    $('#save-btn').on('click', function () {
        // 获取裁剪区的base64格式
        const dataURL = $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        }).toDataURL('image/jpeg')
        console.log(dataURL);

        // 手动构建查询参数
        const search = new URLSearchParams()
        search.append('avatar', dataURL)
        // 发送 ajax 请求
        axios.post('/my/update/avatar', search)
            .then(res => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更换头像失败')
                }
                layer.msg('更换头像成功')
                window.parent.getUserInfo()
            })
    })
})