const Koa = require('koa')
const Router = require('@koa/router')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')
const koa2Req = require('koa2-request')   // 向其他服务器发送请求
const cors = require('koa2-cors')

const app = new Koa()
app.use(cors())   // 解决跨域问题
const router = new Router()

// 引入小程序路由模块
const index = require('./routes/index.js')
// 引入后台管理系统路由模块
const admin = require('./routes/admin.js')

app.use(bodyParser())
app.use(serve(path.join(__dirname, './public')))

// 挂载小程序路由模块
router.use('/index', index)
// 挂载后台管理系统路由模块
router.use('/admin', admin)

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen('3000', () =>{
  console.log('serve is running...')
})




