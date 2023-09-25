const { sign, verify } = require('jsonwebtoken')

const createToken = (user) => {
    const accessToken = sign(
        { 
        usersanme: user.username,
        id:user.id
        },
        "SECRET"
    )
    return accessToken;
}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"]


    if (!accessToken) {
        return res.status(400).json({ error: "User not authenticated" })
    }
    try {
        const validToken = verify(accessToken, "SECRET")
        if (validToken) {
            req.authentificated = true
            
            return next();
        }
    }
    catch (err) {
        return res.status(400).json({ error: err });
    }
}

const validateTokenID = (req, res, next) => {
    const accessToken = req.cookies["access-token"]


    if (!accessToken) {
        return res.status(400).json({ error: "User not authenticated" })
    }
    try {
        const validToken = verify(accessToken, "SECRET")
        if (validToken) {
            req.authentificated = true
            req.userId = validToken.id; 
            return next();
        }
    }
    catch (err) {
        return res.status(400).json({ error: err });
    }
}

module.exports = { createToken, validateToken, validateTokenID}
