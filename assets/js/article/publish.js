$(function () {
    const { layer, form } = layui
    // 定义一个 state 
    let state = ''
    // 从服务器器获取文章的分类列表数据
    getCateList()
    function getCateList() {
        axios.get('/my/article/cates')
            .then(res => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                }
                // 动态获取数据添加到下拉选择框
                res.data.forEach(item => {
                    $('#cate-sel').append(`<option value="${item.Id}">${item.name}</option>`)
                })
                // 更新表单
                form.render('select')
            })
    }
    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 手动触发 文件上传的点击事件
    $('#choose-btn').on('click', function () {
        $('#file').click()
    })

    // 给文件上传框绑定 change 事件
    $('#file').on('change', function () {
        // console.log(this.files);
        if (this.files.length === 0) {
            return layer.msg('获取图片失败')
        }
        // 将图片转换成 url 地址格式
        const imgURL = URL.createObjectURL(this.files[0])
        // 替换裁剪区的图片
        $image.cropper('replace', imgURL)
    })

    // 为表单绑定提交事件
    $('.publish-form').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中的所有内容
        const fd = new FormData(this)
        fd.forEach(item => {
            console.log(item);
        })
        // 向 fd 添加 state 数据
        fd.append('state', state)
        // 获取裁剪区域图片的二进制数据
        $image.cropper('getCroppedCanvas', {
            // 指定裁剪后图片的宽高
            width: 100,
            height: 100
        }).toBlob(blob => {
            console.log(blob);
            // 将获取到的图片添加到 formdata 中
            fd.append('cover_img', blob)
            // 调用函数，提交数据到服务器
            publishArticle(fd)
        })
    })

    $('.last-row button').on('click', function () {
        state = $(this).data('state')
        console.log(state);
    })
    // 函数封装 ajax 请求
    function publishArticle(fd) {
        axios.post('/my/article/add', fd)
            .then(res => {
                // console.log(res);
                // 判断
                if (res.status !== 0) {
                    return layer.msg(state == '已发布' ? '发布文章失败!' : '保存草稿失败')
                }
                layer.msg(state == '已发布' ? '发布文章成功!' : '保存草稿成功')
                // 跳转页面
                location.href = './list.html'
                // 更新导航
                window.parent.$('.layui-this').prev().find('a').click()
            })
    }
})