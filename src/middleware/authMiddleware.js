const jwt = require('jsonwebtoken')

const authMiddleware = (request, response, next) => {
    if (request.method === 'OPTIONS') {
        next()
    }
    try {
        const token = request.headers.authorization.split(' ')[1]
        if (!token) return response.status(403).json({message: 'User is not authorized!'})
        request.user = jwt.verify(token, process.env.SECRET_KEY_JWT)
        next()
    }
    catch (error) {
        console.log(error)
        return response.status(400).json({message: 'User is not authorized!'})
    }
}

module.exports = authMiddleware