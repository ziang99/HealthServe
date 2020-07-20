const router = require('@koa/router')()
const db = require('../../module/db.js')    // 引入操作数据库通用api

router
  // 健康状况表单数据接口
  .put('/', async (ctx, next) => {
    let infoObj = ctx.request.body
    if(!infoObj || Object.keys(infoObj).length === 0){
      ctx.body = { desc: '请求参数错误', code: 400 }
    }
    let { contact, cold, symptom, dangerous, temperature, id } = infoObj
    let sql = 'update healthform set contact = ?, cold = ?, symptom = ?, dangerous = ?, temperature = ? where pid = ?'
    let data = [contact, cold, symptom, dangerous, temperature, id]
    let result = await db.base(sql, data)
    // console.log(result)
    if(result.affectedRows == 1){
      ctx.body = { desc: '写入成功', code: 200 }
    }else{
      ctx.body = { desc: '写入失败', code: 400 }
    }
  })

module.exports = router.routes()
