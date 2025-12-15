import jwt from "jsonwebtoken";




export const generateToken =(payload) => {
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    return jwt.sign(payload,process.env.JWT_SECRET,{ expiresIn });
}

export const verifyToken = (token) => {
    try {
        return jwt.verify(token,process.env.JWT_SECRET)
    }catch(error) {
        if(error.name === 'TokenExpiredError') {
            throw new Error('Session has expired.');
        }
        throw error
    }

}