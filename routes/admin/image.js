const router = require('@koa/router')()
const db = require('../../module/db.js')
const upload = require('./image/upload.js')
const update = require('./image/update.js')
const fs = require('fs')

router
  // 查询图片
  .get('/', async (ctx, next) => {
    // console.log(ctx.query)
    let { pagenum, pagesize } = ctx.query
    let num = Number(pagenum)
    let size = Number(pagesize)
    let num1 = (num - 1) * size
    let num2 = size
    let sql = 'select * from image LIMIT ?, ?'
    let data = [num1, num2]
    let result = await db.base(sql, data)
    // console.log(result)
    let sql2 = "select * from image"
    let result2 = await db.base(sql2)
    
    if (result.length === 0 || !result) {
      ctx.body = { desc: '图片数据请求失败', code: 400 }
    } else {
      ctx.body = { data: result, total: result2.length, desc: '请求成功', code: 200 }
    }
  })

  // 删除图片
  .delete('/:id', async (ctx, next) => {
    // console.log(ctx.params);
    let id = ctx.params.id
    // 在image文件夹中删除
    let sql1 = 'select url from image where id = ?'
    let data1 = id
    let result1 = await db.base(sql1, data1)
    // console.log(result1[0].url);
    fs.unlink(`public${result1[0].url}`, (err) => {
      if(err){
        console.log(err);
        return;
      }
      // console.log('旧图片删除成功');
    })
    // 在数据库中删除
    let sql = 'delete from image where id = ?'
    let data = id
    let result = await db.base(sql, data)
    // console.log(result)
    if (!result || result.affectedRows !== 1) {
      ctx.body = { desc: '图片删除失败', code: 400 }
    } else {
      ctx.body = { desc: '图片删除成功', code: 200 }
    }
  })

// 添加图片
router.use('/upload', upload)
// 修改图片
router.use('/update', update)


module.exports = router.routes()