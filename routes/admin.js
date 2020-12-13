const router = require('@koa/router')()
const verifyToken = require('./admin/verifyToken.js')
const login = require('./admin/login.js')
const image = require('./admin/image.js')
const grade = require('./admin/grade.js')
const healthform = require('./admin/healthform.js')
const listdetail = require('./admin/listdetail.js')
const adminuser = require('./admin/adminuser.js')
const user = require('./admin/user.js')
const menus = require('./admin/menus.js')
const readList = require('./admin/readList.js')


router.use(verifyToken)
router.use('/login', login)
router.use('/image', image)
router.use('/grade', grade)
router.use('/healthform', healthform)
router.use('/listdetail', listdetail)
router.use('/adminuser', adminuser)
router.use('/user', user)
router.use('/menus', menus)
router.use('/readList', readList)


module.exports = router.routes()