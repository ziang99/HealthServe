const router = require('@koa/router')()
const JwtUtil = require('../../module/jwt.js')   // 引入jwt token工具

router.use(async (ctx, next) => {
  // console.log(ctx.url)
  // console.log(ctx.headers)
  // 除了 /login 请求,其他的所有请求都需要进行token值校验
  if (ctx.url !== '/index/login') {
    let token = ctx.headers.token
    // console.log(token)
    let jwt = new JwtUtil(token)
    let result = jwt.verifyToken()
    // 如果考验通过就next，否则就返回登陆信息已过期
    if (result == 'err') {
      ctx.body = { desc: '登录信息已过期,请重新登录', code: 400 }
    } else {
      await next()
    }
  }else{
    await next()
  } 
})

module.exports = router.routes()
