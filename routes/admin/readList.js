const router = require("@koa/router")();
const db = require("../../module/db.js");

router
  // 阅读列表查询
  .get("/", async (ctx, next) => {
    // 获取类目信息
    let sql1 = "select id,content from readlist where level = 0";
    let resOne = await db.base(sql1);
    // 获取列表信息
    let sql2 = "select id,content,pid from readlist where level = 1";
    let resTwo = await db.base(sql2);
    resOne.forEach((item) => {
      let arr = resTwo.filter((flag) => {
        return flag.pid == item.id;
      });
      item.childrens = arr;
    });
    // console.log(resOne)
    // 返回数据
    if (resOne.length == 0 || !resOne) {
      ctx.body = { desc: "请求失败", code: 400 };
    } else {
      ctx.body = { data: resOne, desc: "请求成功", code: 200 };
    }
  })
  // 添加类目
  .post('/', async (ctx, next) => {
    // console.log(ctx.request.body)
    let { content, pid, level } = ctx.request.body
    if(ctx.request.body === {} || !ctx.request.body){
      ctx.body = { desc: '请求参数错误', code: 400 }
    }
    let sql1 = 'select * from readlist where content = ?'
    let result1 = await db.base(sql1, content)
    if(result1 && result1.length !== 0) {
      ctx.body = { desc: '该类目已存在', code: 412 }
    }else{
      let sql = 'insert into readlist (content, pid, level) values (?, ?, ?)'
      let data = [content, pid, level]
      let res = await db.base(sql, data)
      // console.log(res);
      // 返回数据
      if (res.affectedRows == 1) {
        ctx.body = { desc: '请求成功', code: 200 }
      } else {
        ctx.body = { desc: '添加失败', code: 400 }
      }
    }
  })
  // 根据类目id获取相应信息
  .get('/:id', async (ctx, next) => {
    // console.log(ctx.params)
    let { id } = ctx.params
    if(!id){
      ctx.body = { desc: '请求参数错误', code: 400 }
    }
    let sql = 'select * from readlist where id = ?'
    let res = await db.base(sql, id)
    // console.log(res)
    // 返回数据
    if (res[0].content) {
      ctx.body = { desc: '查询成功', data: res[0], code: 200 }
    } else {
      ctx.body = { desc: '查询失败', code: 400 }
    }
  })
  // 修改类目
  .put('/', async (ctx, next) => {
    let { id, content, pid, level } = ctx.request.body
    if(!id || !content || !pid || !level){
      ctx.body = { desc: '请求参数错误', code: 400 }
    }
    let sql1 = 'select * from readlist where content = ?'
    let result1 = await db.base(sql1, content)
    if(result1 && result1.length !== 0) {
      ctx.body = { desc: '该类目已存在', code: 412 }
    }else{
      let sql = 'UPDATE readlist set content=?, pid=?, level=? where id = ?'
      let data = [content, pid, level, id]
      let res = await db.base(sql, data)
      // console.log(res)
      // 返回数据
      if (res.affectedRows == 1) {
        ctx.body = { desc: '修改成功', code: 200 }
      } else {
        ctx.body = { desc: '修改失败', code: 400 }
      }
    }
  })
  // 删除类目
  .delete('/:id', async (ctx, next) => {
    let { id } = ctx.params
    // console.log(ctx.params);
    if(!id){
      ctx.body = { desc: '请求参数错误', code: 400 }
    }
    let sql = 'DELETE FROM readlist WHERE id = ?'
    let data = id
    let res = await db.base(sql, data)
    // console.log(res)
    // 返回数据
    if (res.affectedRows == 1) {
      ctx.body = { desc: '删除成功', code: 200 }
    } else {
      ctx.body = { desc: '删除失败', code: 400 }
    }
  })


module.exports = router.routes();
