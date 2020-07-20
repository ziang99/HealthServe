const router = require('@koa/router')()
const db = require('../../module/db.js')

router
  // 管理员查询
  .get('/', async (ctx, next) => {
    // console.log(ctx.query)
    // 分页
    let { query, pagenum, pagesize } = ctx.query
    let num = Number(pagenum)
    let size = Number(pagesize)
    let num1 = (num - 1) * size
    let num2 = size
    let sql = 'select * from adminuser LIMIT ?, ?'
    let data = [num1, num2]
    let result = await db.base(sql, data)
    // console.log(result)
    // 获得总条数
    let sql2 = 'select * from adminuser'
    let result2 = await db.base(sql2)
    // 判断用户的输入情况
    if(query) {
      let str = `%${query}%`
      let sqls = 'select * from adminuser where username like ?'
      let results = await db.base(sqls, str)
      // console.log(results)
      // ctx.body = { data: results, desc: '搜索成功', code: 201 }
      if(!results || results.length === 0){
        ctx.body = { desc: '查询失败', code: 400 }
      }else{
        ctx.body = { data: results, total: results.length, desc: '查询成功', code: 200 }
      }
    }else{
      if(!result || result.length === 0){
        ctx.body = { desc: '查询失败', code: 400 }
      }else{
        ctx.body = { data: result, total: result2.length, desc: '查询成功', code: 200 }
      }
    }
    
  })

  // 管理员添加
  .post('/', async (ctx, next) => {
    let { username, password } = ctx.request.body
    if(!username || !password){
      ctx.body = { desc: '请求参数错误', code: 400 }
    }
    let sql1 = 'select * from adminuser where username = ?'
    let result1 = await db.base(sql1, username)
    // console.log(result1);
    if(result1 && result1.length !== 0) {
      ctx.body = { desc: '该用户已存在', code: 412 }
    }else{
      let sql = 'insert into adminuser (username, password) values (?, ?)'
      let data = [username, password]
      let result = await db.base(sql, data)
      // console.log(result);
      if (result.affectedRows == 1) {
        ctx.body = { desc: '添加成功', code: 200 }
      } else {
        ctx.body = { desc: '添加失败', code: 400 }
      }
    }
  })

  // 管理员删除
  .delete('/:id', async (ctx, next) => {
    let { id } = ctx.params
    if(!id){
      ctx.body = { desc: '请求参数错误', code: 400 }
    }
    let sql = 'DELETE FROM adminuser WHERE id = ?'
    let res = await db.base(sql, id)
    // console.log(res)
    // 返回数据
    if (res.affectedRows === 1) {
      ctx.body = { desc: '删除成功', code: 200 }
    } else {
      ctx.body = { desc: '删除失败', code: 400 }
    }
  })

  // 根据管理员id获取相应信息
  .get('/:id', async (ctx, next) => {
    // console.log(ctx.params)
    let { id } = ctx.params
    if(!id){
      ctx.body = { desc: '请求参数错误', code: 400 }
    }
    let sql = 'select * from adminuser where id = ?'
    let res = await db.base(sql, id)
    // console.log(res)
    // 返回数据
    if (res[0].username) {
      ctx.body = { desc: '查询成功', data: res[0], code: 200 }
    } else {
      ctx.body = { desc: '查询失败', code: 400 }
    }
  })
  
  // 管理员修改
  .put('/', async (ctx, next) => {
    let { id, username, password } = ctx.request.body
    if(!id){
      ctx.body = { desc: '请求参数错误', code: 400 }
    }
    let sql = 'UPDATE adminuser set username=?, password=? where id = ?'
    let data = [username, password, id]
    let res = await db.base(sql, data)
    // console.log(res)
    // 返回数据
    if (res.affectedRows === 1) {
      ctx.body = { desc: '修改成功', code: 200 }
    } else {
      ctx.body = { desc: '修改失败', code: 400 }
    }
  })


module.exports = router.routes()
