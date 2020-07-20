const router = require('@koa/router')()
const db = require('../../module/db.js')

router
  // 详情页查询
  .get('/', async (ctx, next) => {
    let sql = 'select img from listdetail'
    let result = await db.base(sql)
    let arr = result.map(v => v.img)
    let sql1 = "select * from image where FIND_IN_SET(id, ?)"
    let data1 = arr.toString()
    let result1 = await db.base(sql1, data1)
    if(!result1 || result1.length == 0){
      ctx.body = { desc: '图片数据请求失败', code: 400 }
    }
    // 分页
    // console.log(ctx.query)
    let { query, pagenum, pagesize } = ctx.query
    let num = Number(pagenum)
    let size = Number(pagesize)
    let num1 = (num - 1) * size
    let num2 = size
    let sql2 = "select * from listdetail LIMIT ?, ?"
    let data2 = [num1, num2]
    // console.log(data2)
    let result2 = await db.base(sql2, data2)
    // console.log(result2)
    // 获得总条数
    let sql3 = 'select * from listdetail'
    let result3 = await db.base(sql3)
    result2.forEach((item1) => {
      result1.forEach((item2) => {
        if(item1.img == item2.id){
          item1.img = item2.url
        }
      })
    })
    // console.log(result2)
    // 判断用户的输入情况
    if(query) {
      let str = `%${query}%`
      let sqls = 'select * from listdetail where title like ?'
      let results = await db.base(sqls, str)
      // console.log(results)
      // ctx.body = { data: results, desc: '搜索成功', code: 201 }
      let arr = results.map(v => v.img)
      let sql1 = "select * from image where FIND_IN_SET(id, ?)"
      let data1 = arr.toString()
      let result1 = await db.base(sql1, data1)
      if(!result1 || result1.length == 0){
        ctx.body = { desc: '图片数据请求失败', code: 400 }
      }
      results.forEach((item1) => {
        result1.forEach((item2) => {
          if(item1.img == item2.id){
            item1.img = item2.url
          }
        })
      })
      if(!results || results.length === 0){
        ctx.body = { desc: '查询失败', code: 400 }
      }else{
        ctx.body = { data: results, total: results.length, desc: '查询成功', code: 200 }
      }
    }else{
      if(!result2 || result2.length == 0){
        ctx.body = { desc: '请求失败', code: 400 }
      }else{
        ctx.body = { data: result2, total: result3.length, desc: '请求成功', code: 200 }
      }
    }
  })
  // 父级类目信息
  .get('/category', async (ctx, next) => {
    // 获取类目信息
    let sql1 = "select id,content from readlist where level = 0";
    let resOne = await db.base(sql1);
    // console.log(resOne)
    // 返回数据
    if (resOne.length == 0 || !resOne) {
      ctx.body = { desc: "请求失败", code: 400 };
    } else {
      ctx.body = { data: resOne, desc: "请求成功", code: 200 };
    }
  })
  // 添加信息详情
  .post('/', async (ctx, next) => {
    // console.log(ctx.request.body)
    let { content, date, title, category, img } = ctx.request.body
    date = date.substring(0, 10)
    if(ctx.request.body === {} || !ctx.request.body){
      ctx.body = { desc: '请求参数错误', code: 400 }
    }
    let sql = 'insert into readlist (content, img, pid, level) values (?, ?, ?, 1)'
    let data = [content, img, category]
    let res = await db.base(sql, data)
    // console.log(res);
    let ppid = res.insertId
    let sql1 = 'insert into listdetail (img, title, content, pid, date) values (?, ?, ?, ?, ?)'
    let data1 = [img, title, content, ppid, date]
    let res1 = await db.base(sql1, data1)
    // console.log(res1);
    // 返回数据
    if (res.affectedRows == 1) {
      ctx.body = { desc: '请求成功', code: 200 }
    } else {
      ctx.body = { desc: '添加失败', code: 400 }
    }
    
  })

  // 根据id获取相应信息
  .get('/:id', async (ctx, next) => {
    // console.log(ctx.params)
    let { id } = ctx.params
    if(!id){
      ctx.body = { desc: '请求参数错误', code: 400 }
    }
    let sql = 'select * from listdetail where id = ?'
    let res = await db.base(sql, id)
    // console.log(res[0].pid)
    let sql1 = 'select pid from readlist where id = ?'
    let res1 = await db.base(sql1, res[0].pid)
    // console.log(res1)
    let sql2 = 'select content from readlist where id = ?'
    let res2 = await db.base(sql2, res1[0].pid)
    // console.log(res2)
    res[0].category = res2[0].content
    // console.log(res[0])
    // 返回数据
    if (res[0].title) {
      ctx.body = { desc: '查询成功', data: res[0], code: 200 }
    } else {
      ctx.body = { desc: '查询失败', code: 400 }
    }
  })
  // 信息修改
  .put('/', async (ctx, next) => {
    // console.log(ctx.request.body)
    let { content, date, title, category, img, id, pid } = ctx.request.body
    date = date.substring(0, 10)
    if(ctx.request.body === {} || !ctx.request.body){
      ctx.body = { desc: '请求参数错误', code: 400 }
    }

    let sql6 = 'select id from readlist where content = ?'
    let res6 = await db.base(sql6, category)
    // console.log(res6)
    let sql = 'UPDATE readlist set content=?, img=?, pid=?, level=1 where id = ?'
    let data = [content, img, res6[0].id, pid]
    let res = await db.base(sql, data)
    // console.log(res);
    let sql1 = 'UPDATE listdetail set img=?, title=?, content=?, pid=?, date=? where id = ?'
    let data1 = [img, title, content, pid, date, id]
    let res1 = await db.base(sql1, data1)
    // console.log(res1);
    // 返回数据
    if (res1.affectedRows === 1) {
      ctx.body = { desc: '修改成功', code: 200 }
    } else {
      ctx.body = { desc: '修改失败', code: 400 }
    }
  })

  // 信息删除
  .delete('/:id', async (ctx, next) => {
    let { id } = ctx.params
    if(!id){
      ctx.body = { desc: '请求参数错误', code: 400 }
    }
    let sql3 = 'select img FROM listdetail WHERE id = ?'
    let res3 = await db.base(sql3, id)

    let sql1 = 'select pid FROM listdetail WHERE id = ?'
    let res1 = await db.base(sql1, id)
    // console.log(res1)
    let sql2 = 'DELETE FROM readlist WHERE id = ?'
    let res2 = await db.base(sql2, res1[0].pid)
    // console.log(res2)
    let sql = 'DELETE FROM listdetail WHERE id = ?'
    let res = await db.base(sql, id)
    // console.log(res)

    // 返回数据
    if (res.affectedRows === 1 && res2.affectedRows === 1) {
      ctx.body = { desc: '删除成功', data: { id: res3[0].img }, code: 200 }
    } else {
      ctx.body = { desc: '删除失败', code: 400 }
    }
  })


module.exports = router.routes()
