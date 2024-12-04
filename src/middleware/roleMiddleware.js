const jwt = require('jsonwebtoken')

/** @Documentation roles[] - allowed roles */
const roleMiddleware = (roles) => (request, response, next) => {
    if (request.method === 'OPTIONS') {
        next()
    }
    try {
        const token = request.headers.authorization.split(' ')[1]
        if (!token) return response.status(403).json({message: 'User is not authorized!'})
        const {roles: userRoles} = jwt.verify(token, process.env.SECRET_KEY_JWT)
        let hashRole = false
        userRoles.forEach(role => {
            if (roles.includes(role)) {
                hashRole = true
            }
        })
        if (!hashRole) {
            response.status(403).json({message: 'You dont have access'})
        }
        next()
    }
    catch (error) {
        console.log(error)
        return response.status(400).json({message: 'User is not authorized!'})
    }
}

module.exports = roleMiddleware