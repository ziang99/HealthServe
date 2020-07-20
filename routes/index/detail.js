const router = require('@koa/router')()
const db = require('../../module/db.js')    // 引入操作数据库通用api

router
  // 提交个人信息表单数据接口
  .get('/:id', async (ctx, next) => {
    // console.log(ctx.params)
    let id = ctx.params.id
    if(!id){
      ctx.body = { desc: '请求参数错误', code: 400 }
    }
    let sql = 'select img from listdetail where pid = ?'
    let data = id
    let result = await db.base(sql, data)
    // console.log(result)
    let arr = result.map(({ img }) => img)
    // console.log(arr)
    let sql1 = "select * from image where FIND_IN_SET(id, ?)"
    let data1 = arr.toString()
    let result1 = await db.base(sql1, data1)
    // console.log(result1)
    if(!result1 || result1.length == 0){
      ctx.body = { desc: '图片数据请求失败', code: 400 }
    }
    
    let sql2 = "select * from listdetail where pid = ?"
    let data2 = id
    let result2 = await db.base(sql2, data2)
    result2.forEach((item1) => {
      result1.forEach((item2) => {
        if(item1.img == item2.id){
          item1.img = item2.url
        }
      })
    })
    // console.log(result2)
    if(!result2 || result2.length == 0){
      ctx.body = { desc: '请求失败', code: 400 }
    }else{
      ctx.body = { data: result2, desc: '请求成功', code: 200 }
    } 
  })



module.exports = router.routes()
