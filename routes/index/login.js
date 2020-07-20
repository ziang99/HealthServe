const router = require('@koa/router')()
const db = require('../../module/db.js')    // 引入操作数据库通用api
const JwtUtil = require('../../module/jwt.js')   // 引入jwt token工具

router
  .post('/', async (ctx, next) => {
    let { username, password } = ctx.request.body
    let sql = 'select id, name from user where username = ? and password = ?'
    let data = [username, password]
    let result = await db.base(sql, data)
    // console.log(result)
    if(result.length == 0 || !result){
      ctx.body = { desc: '请检查学号或密码', code: 400 }
    }else{
      // 添加token验证
      let id = result[0].id.toString();
      // 将用户的id传入并生成token
      let jwt = new JwtUtil(id);
      let tokenStr = jwt.generateToken();
      // 将生成的token字符串添加到返回给前端的对象中
      result[0].token = tokenStr;
      // 返回数据
      ctx.body = {
        data: result[0],
        desc: '请求成功',
        code: 200
      }
    } 
  })


module.exports = router.routes()