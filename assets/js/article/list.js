$(function () {
    const { layer, form, laypage } = layui
    getCateList()
    //  获取文章列表数据
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

    // 定义一个查询对象
    const query = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每次显示几条数据
        cate_id: '',
        state: ''
    }

    // 发送 ajax 请求
    renderTable()
    function renderTable() {
        axios.get('/my/article/list', { params: query })
            .then(res => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                }
                // 使用模板引擎渲染页面
                const htmlStr = template('tpl', res)
                $('tbody').html(htmlStr)
                // 调用分页器函数
                renderPage(res.total)
            })
    }

    function renderPage(total) {
        laypage.render({
            elem: 'pagination', //注意，这里的 test1 是 ID，不用加 # 号
            count: total,  //数据总数，从服务端得到
            limit: query.pagesize, // 每页显示的数量
            limits: [2, 3, 4, 5], // 每页的数据 条数
            curr: query.pagenum, // 当前的页码值
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                // 修改查询参数的参数
                query.pagenum = obj.curr
                query.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    // 除了第一次，都需要重新渲染表格数据
                    renderTable()
                }
            }
        });
    }

    // 表单筛选
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        const cate_id = $('#cate-sel').val()
        const state = $('#state').val()

        // 将获取到的值重新赋值给 query 对象
        query.cate_id = cate_id
        query.state = state
        // console.log(cate_id, state);

        // 重新渲染表格
        renderTable()
    })

    // 删除
    $(document).on('click', '.del-btn', function () {
        const id = $(this).data('id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            axios.get(`/my/article/delete/${id}`)
                .then(res => {
                    if (res.status !== 0) {
                        return layer.msg('删除失败!')
                    }
                    layer.close(index);
                    layer.msg('删除成功')

                    // 填坑处理： 当前页面只有一条数据且不处在第一页的时候，点击删除之后应该手动更新上一页的数据
                    if ($('.del-btn').length == 1 && query.pagenum !== 1) {
                        // 当前页码值减一
                        query.pagenum--
                    }
                    // 重新渲染
                    renderTable()
                })
        })
    })
})