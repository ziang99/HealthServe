const router = require('@koa/router')()
const verifyToken = require('./index/verifyToken.js')   // 引入验证token类
const login = require('./index/login.js')
const registe = require('./index/registe.js')
const addinfo = require('./index/addinfo.js')
const home = require('./index/home.js')
const detail = require('./index/detail.js')
const healthstatus = require('./index/healthstatus.js')


router.use(verifyToken)
router.use('/login', login)
router.use('/registe', registe)
router.use('/addinfo', addinfo)
router.use('/home', home)
router.use('/detail', detail)
router.use('/healthstatus', healthstatus)


module.exports = router.routes()
