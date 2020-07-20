const router = require('@koa/router')()
const db = require('../../module/db.js')    // 引入操作数据库通用api

router
  // 信息录入状况接口
  .get('/checkinfo/:id', async (ctx, next) => {
    // console.log(ctx.params)
    let id = ctx.params.id
    let sql = 'select * from user where id = ?'
    let data = id
    let result = await db.base(sql, data)
    // console.log(result)
    if(result.length == 0 || !result){
      ctx.body = { desc: '信息录入情况请求失败', code: 400 }
    }else{
      ctx.body = { data: result[0], desc: '请求成功', code: 200 }
    }
  })
  
  // 获取班级信息接口
  .get('/', async (ctx, next) => {
    // 获取年级信息
    let sql1 = 'select id,name from class where level = 0'
    let resOne = await db.base(sql1)
    // 获取班级信息
    let sql2 = 'select id,name,pid from class where level = 1'
    let resTwo = await db.base(sql2)
    if(resOne.length == 0 || !resOne || resTwo.length == 0 || !resTwo){
      ctx.body = { desc: '读取失败', code: 400 }
    }
    resOne.forEach((item) => {
      let arr = resTwo.filter((flag) => {
        return flag.pid == item.id
      })
      item.childrens = arr
    })
    // 返回数据
    ctx.body = { data: resOne, desc: '请求成功', code: 200 }
  })
  
  // 提交个人信息表单数据接口
  .put('/', async (ctx, next) => {
    let infoObj = ctx.request.body
    if(!infoObj || infoObj == {}){
      ctx.body = { desc: '请求参数错误', code: 400 }
    }
    let { name, gender, phone, qq, classes, address, id } = infoObj
    let sql = 'update user set name = ?, gender = ?, phone = ?, qq = ?, class = ?, address = ? where id = ?'
    let data = [name, gender, phone, qq, classes, address, id]
    let result = await db.base(sql, data)
    // console.log(result)
    if(result.affectedRows == 1){
      ctx.body = { desc: '写入成功', code: 200 }
    }else{
      ctx.body = { desc: '写入失败', code: 400 }
    } 
  })


module.exports = router.routes()

















