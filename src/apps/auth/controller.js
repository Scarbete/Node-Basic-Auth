const User = require('../user/model')
const Role = require('../role/model')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')

const generateAccessToken = (id, roles) => {
    const payload = {id, roles}
    return jwt.sign(
        payload,
        process.env.SECRET_KEY_JWT,
        {expiresIn: process.env.SECRET_KEY_EXPIRES}
    )
}

class Controller {
    async registration(request, response) {
        try {
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                return response.status(400).json({message: 'Error in registration (password: min 4, max 20)', errors})
            }
            const { username, password } = request.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return response.status(400).json({message: 'There is already a user with this name'})
            }
            const hashedPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({value: 'ADMIN'})
            const user = new User({username, password: hashedPassword, roles: [userRole.value]})
            await user.save()
            return response.json({message: 'User registered successfully'})
        }
        catch (error) {
            console.log(error)
            response.status(400).json({message: 'registration error'})
        }
    }

    async login(request, response) {
        try {
            const {username, password} = request.body
            const user = await User.findOne({username})
            if (!user) {
                return response.status(400).json({message: 'User does not exist'})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return response.status(400).json({message: 'Passwords do not match'})
            }
            const token = generateAccessToken(user._id, user.roles)
            return response.json({token})
        }
        catch (error) {
            console.log(error)
            response.status(400).json({message: 'login error'})
        }
    }

    async getUsers(request, response) {
        try {
            const users = await User.find()
            response.json(users)
        }
        catch (error) {
            console.log(error)
        }
    }
}

module.exports = new Controller()