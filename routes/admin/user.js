const router = require('@koa/router')()
const db = require('../../module/db.js')

router
  // 用户查询
  .get('/', async (ctx, next) => {
    let sql = 'select * from user'
    let result = await db.base(sql)
    // console.log(result);
    if(!result || result.length == 0){
      ctx.body = { desc: '查询失败', code: 400 }
    }else{
      ctx.body = { data: result, desc: '查询成功', code: 200 }
    }
  })

  // 用户删除
  .delete('/:id', async (ctx, next) => {
    let { id } = ctx.params
    if(!id){
      ctx.body = { desc: '请求参数错误', code: 400 }
    }
    let sql = 'DELETE FROM user WHERE id = ?'
    let res = await db.base(sql, id)
    let sql1 = 'DELETE FROM healthform WHERE pid = ?'
    let res1 = await db.base(sql1, id)
    // 返回数据
    if (res.affectedRows === 1 && res1.affectedRows === 1) {
      ctx.body = { desc: '删除成功', code: 200 }
    } else {
      ctx.body = { desc: '删除失败', code: 400 }
    }
  })


module.exports = router.routes()
