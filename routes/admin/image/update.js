const router = require('@koa/router')()
const db = require('../../../module/db.js')
const multer = require('@koa/multer');    // 引入图片上传中间件
const fs = require('fs')

// 配置上传的文件目录及文件名
const storage = multer.diskStorage({
  // 图片的保存地址
  destination: (req, file, cb) => {
    cb(null, './public/image') //需要手动创建
  },
  // 保存的文件名
  filename: (req, file, cb) => {
    // 获取图片后缀名
    let suffixName = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
    // 设置图片新名称
    let newName = new Date().getTime() + parseInt(Math.random() * 99999)
    cb(null, `${newName}.${suffixName}`)
  }
})

//加载配置
const upload = multer({ storage })

router
  // 修改图片
  .post('/', upload.single('file'), async (ctx, next) => {
    // console.log(ctx.request.body);
    let id = ctx.request.body.id
    // console.log(id, ctx.file);
    if(!ctx.file || ctx.file == {} || !ctx.file.size){
      ctx.body = { desc: '上传错误', code: 403 }
    }
    let { size, originalname } = ctx.file   // 获取到图片的大小和名字
    let types = ['jpg', 'png', 'jpeg']      // 定义允许上传的图片类型
    let suffixName = originalname.substring(originalname.lastIndexOf('.') + 1)  // 获取到上传来的图片后缀名
    // 判断图片大小和类型
    if(size > 1048576){
      ctx.body = { desc: '图片太大', code: 401 }
      fs.unlink(`public/image/${ctx.file.filename}`, (err) => {
        if(err){
          console.log(err);
          return;
        }
        // console.log('图片太大删除成功');
      })
    }else if(types.indexOf(suffixName) == -1){
      ctx.body = { desc: '格式有误', code: 402 }
      fs.unlink(`public/image/${ctx.file.filename}`, (err) => {
        if(err){
          console.log(err);
          return;
        }
        // console.log('格式有误删除成功');
      })
    }else{
      let url = `/image/${ctx.file.filename}`   // 保存在 image 文件夹下的图片名称
      // console.log(url);
      // 先根据要修改的图片的id，去数据库里查询相应图片的路径名称
      let sql1 = 'select url from image where id = ?'
      let data1 = id
      let result1 = await db.base(sql1, data1)
      // console.log(result1[0].url);
      // 再根据名称把image文件夹下的旧图片删除掉
      fs.unlink(`public${result1[0].url}`, (err) => {
        if(err){
          console.log(err);
          return;
        }
        //console.log('旧图片删除成功');
      })
      // 根据id在数据库里进行修改
      let sql = 'update image set url = ? where id = ?'
      let data = [url, id]
      let result = await db.base(sql, data)
      // console.log(result);
      if(!result || result.affectedRows !== 1){
        ctx.body = { desc: '图片修改失败', code: 400 }
      }else{
        ctx.body = { desc: '图片修改成功', code: 200 }
      }
    }
  })


module.exports = router.routes()

