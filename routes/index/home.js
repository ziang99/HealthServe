const router = require('@koa/router')()
const db = require('../../module/db.js')    // 引入操作数据库通用api

router
  // 获取首页数据接口
  .get('/', async (ctx, next) => {
    // 轮播图
    // 先获得到banner表的图片img字段
    let sql = 'select img from banner'
    let result = await db.base(sql)
    let arr = result.map(({ img }) => img)
    // 再根据img字段去image表查询图片路径地址
    let sql1 = "select * from image where FIND_IN_SET(id, ?)"
    let data1 = arr.toString()
    let result1 = await db.base(sql1, data1)
    // console.log(result1)
    if(!result1 || result1.length == 0){
      ctx.body = { desc: '轮播图数据请求失败', code: 400 }
    }
    
    // 通告栏
    let sql2 = "select * from notice"
    let result2 = await db.base(sql2)
    // console.log(result2)
    if(!result2 || result2.length == 0){
      ctx.body = { desc: '通告栏数据请求失败', code: 400 }
    }
    
    // 导航
    // 先获得到nav表的图片img字段
    let sql3 = "select img from nav"
    let result3 = await db.base(sql3)
    let arr3 = result3.map(({ img }) => img)
    // 再根据img字段去image表查询图片路径地址
    let sql4 = "select * from image where FIND_IN_SET(id, ?)"
    let data4 = arr3.toString()
    let result4 = await db.base(sql4, data4)
    // console.log(result4)
    // 最后再把nav表的img字段数据用查询到的图片地址替换掉
    let sql5 = "select * from nav"
    let result5 = await db.base(sql5)
    result5.forEach((item1) => {
      result4.forEach((item2) => {
        if(item1.img == item2.id){
          item1.img = item2.url
        }
      })
    })
    // console.log(result5)
    if(!result5 || result5.length == 0){
      ctx.body = { desc: '导航数据请求失败', code: 400 }
    }
    
    // 将所有数据集成到一个对象中，响应给前端
    let finalObj = {}
    finalObj.banner = result1
    finalObj.notice = result2
    finalObj.nav = result5
    // console.log(finalObj)
    if(!finalObj || finalObj == {}){
      ctx.body = { desc: '数据请求失败', code: 400 }
    }else{
      ctx.body = { data: finalObj, desc: '请求成功', code: 200 }
    } 
  })
  
  // 获取阅读列表数据接口
  .get('/readlist', async (ctx, next) => {
    // 先获得到readlist表的img字段
    let sql = 'select img from readlist where level = 1'
    let result = await db.base(sql)
    let arr = result.map(({ img }) => img)
    // 再根据img字段去image表查询图片路径地址
    let sql1 = "select * from image where FIND_IN_SET(id, ?)"
    let data1 = arr.toString()
    let result1 = await db.base(sql1, data1)
    // console.log(result1)
    if(!result1 || result1.length == 0){
      ctx.body = { desc: '图片路径地址请求失败', code: 400 }
    }
    
    // 最后再把readlist表的img字段数据用查询到的图片地址替换掉
    let sql2 = "select * from readlist where level = 1"
    let result2 = await db.base(sql2)
    result2.forEach((item1) => {
      result1.forEach((item2) => {
        if(item1.img == item2.id){
          item1.img = item2.url
        }
      })
    })
    // console.log(result2)
    if(!result2 || result2.length == 0){
      ctx.body = { desc: '内容信息请求失败', code: 400 }
    }
    
    // 获取readlist标题信息
    let sql3 = 'select id,content from readlist where level = 0'
    let resOne = await db.base(sql3)
    // console.log(resOne)
    if(!resOne || resOne.length == 0){
      ctx.body = { desc: '标题信息请求失败', code: 400 }
    }
    
    resOne.forEach((item) => {
      let arr = result2.filter((flag) => {
        return flag.pid == item.id
      })
      item.childrens = arr
    })
    // 返回数据
    ctx.body = { data: resOne, desc: '请求成功', code: 200 }
  })
  

module.exports = router.routes()