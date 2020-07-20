const router = require('@koa/router')()
const db = require('../../module/db.js')    // 引入操作数据库通用api

router
  // 健康状况表单查看
  .get('/', async (ctx, next) => {
    let sql = 'select * from healthform'
    let result = await db.base(sql)
    // console.log(result)
    let sql1 = 'select id,name from user'
    let result1 = await db.base(sql1)
    // console.log(result1)
    for(i of result){
      for(j of result1) {
        if(i.pid === j.id){
          i.name = j.name
        }
      }
    } 
    // console.log(result)
    // 返回数据
    if(result.length == 0){
      ctx.body = { desc: '查询失败', code: 400 }
    }else{
      ctx.body = { data: result, desc: '查询成功', code: 200 }
    }
  })

  // 柱状图
  .get('/bar', async (ctx, next) => {
    // 接触过疑似人数
    let sql = 'select contact from healthform where contact = 1'
    let contact = await db.base(sql)
    // console.log(contact.length)
    // 感冒等症状似人数
    let sql1 = 'select cold from healthform where cold = 1'
    let cold = await db.base(sql1)
    // console.log(cold.length)
    // 呕吐等症状人数
    let sql2 = 'select symptom from healthform where symptom = 1'
    let symptom = await db.base(sql2)
    // console.log(symptom.length)
    // 逗留风险区人数
    let sql3 = 'select dangerous from healthform where dangerous = 1'
    let dangerous = await db.base(sql3)
    // console.log(dangerous.length)
    // 返回数据
    if(!contact || !cold || !symptom || !dangerous){
      ctx.body = { desc: '查询失败', code: 400 }
    }else{
      ctx.body = { data: [contact.length, cold.length, symptom.length, dangerous.length], desc: '查询成功', code: 200 }
    }
  })

module.exports = router.routes()
