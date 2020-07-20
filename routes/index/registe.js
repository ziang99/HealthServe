const router = require('@koa/router')()
const db = require('../../module/db.js')    // 引入操作数据库通用api

router
  .post('/', async (ctx, next) => {
    // console.log(ctx.request.body)
    let { username, password } = ctx.request.body
    // 先将用户想要注册的学号去数据库查询，如果能查询到说明已存在该用户了，查询不到才允许注册
    let sql1 = 'select id, username from user where username = ?'
    let result1 = await db.base(sql1, username)
    // console.log(result1)
    if(result1 && result1.length !== 0) {
      ctx.body = { desc: '该用户已存在', code: 412 }
    }else{
      let sql = 'INSERT INTO user (id, username, password) VALUES (null, ?, ?)'
      let data = [username, password]
      let result = await db.base(sql, data)
      // console.log(result)
      let sql3 = 'select id from user where username = ?'
      let result3 = await db.base(sql3, username)
      let healthPid = result3[0].id
      let sql2 = 'INSERT INTO healthform VALUES (null, null, null, null, null, null, ?)'
      let result2 = await db.base(sql2, healthPid)
      // console.log(result2)
      if(result.affectedRows === 1){
        ctx.body = { desc: '注册成功', code: 200 }
      }else{
        ctx.body = { desc: '注册失败', code: 400 }
      } 
    }
  })


module.exports = router.routes()

