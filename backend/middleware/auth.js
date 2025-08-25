const { getUser } = require('../service/auth')


function checkForAuthentication(req, res, next) {
    const tokenCookie = req.cookies?.token
    req.user = null
    if (!tokenCookie)
        return next()
    const token = tokenCookie
    const user = getUser(token)

    req.user = user
    return next()
}

function restrictTo(roles = []) {
    return function (req, res, next) {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: Please log in" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: You do not have access" });
        }
        return next()
    }
}



module.exports = {
    checkForAuthentication,
    restrictTo
}