$(function () {
    let index
    const { layer, form } = layui
    getCateList()
    function getCateList() {
        axios.get('/my/article/cates')
            .then(res => {
                // console.log(res);
                // 判断
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败')
                }
                // 1.引入插件  2.准备一个模板  3.调用模板函数
                const htmlStr = template('tpl', res)
                // console.log(htmlStr);
                $('tbody').html(htmlStr)
            })
    }

    $('#add-btn').on('click', function () {
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('.add-form-container').html()
        })

    })

    // 监听事件 (事件委托)
    $(document).on('submit', '#add-form', function (e) {
        e.preventDefault()
        // 发送请求
        axios.post('/my/article/addcates', $(this).serialize())
            .then(res => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                }
                layer.close(index)
                getCateList()
            })
    })

    // 编辑
    $(document).on('click', '.edit-btn', function () {
        index = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('.edit-form-container').html()
        })
        //  获取自定义属性的值
        // console.log($(this).data('id'))
        const id = $(this).data('id')
        axios.get(`/my/article/cates/${id}`)
            .then(res => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                }
                //给表单赋值
                form.val('edit-form', res.data);
            })
        // 表单提交事件
        $(document).on('submit', '#edit-form', function (e) {
            e.preventDefault()
            axios.post('/my/article/updatecate', $(this).serialize())
                .then(res => {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('获取失败!')
                    }
                    // 关闭模态框
                    layer.close(index)
                    // 重新渲染页面
                    getCateList()
                })
        })
    })

    // 删除
    $(document).on('click', '.del-btn', function () {
        const id = $(this).data('id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            axios.get(`/my/article/deletecate/${id}`)
                .then(res => {
                    if (res.status !== 0) {
                        return layer.msg('删除失败!')
                    }
                    layer.close(index);
                    layer.msg('删除成功')
                    getCateList()
                })
        })
    })
})
