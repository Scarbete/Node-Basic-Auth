const Router = require('express')
const router = new Router()
const AuthController = require('./controller.js')
const {check} = require('express-validator')
// const authMiddleware = require('../../middleware/authMiddleware')
const roleMiddleware = require('../../middleware/roleMiddleware')

router.post(
    '/registration',
    [
        check('username', 'username is required!').notEmpty(),
        check('password', 'password is required!').isLength({min: 4, max: 20}),
    ],
    AuthController.registration
)

router.post('/login', AuthController.login)
router.get('/users', roleMiddleware(['ADMIN']), AuthController.getUsers)

module.exports = router