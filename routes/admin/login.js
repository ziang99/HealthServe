const router = require('@koa/router')()
const db = require('../../module/db.js')
const JwtUtil = require('../../module/jwt.js')

router
  // 登录接口
  .post('/', async (ctx, next) => {
    let { username, password } = ctx.request.body
    // console.log(username, password)
    let sql = 'select id, username from adminuser where username = ? and password = ?'
    let data = [username, password]
    let result = await db.base(sql, data)
    // console.log(result)
    if(result.length == 0 || !result){
      ctx.body = { desc: '请检查账号或密码', code: 400 }
    }else{
      let id = result[0].id.toString()
      let jwt = new JwtUtil(id)
      let tokenStr = jwt.generateToken()
      result[0].token = tokenStr
      // console.log(tokenStr);
      ctx.body = { data: result[0],desc: '请求成功',code: 200 }
    } 
  })


module.exports = router.routes()
