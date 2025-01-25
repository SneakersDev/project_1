import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const secret_key = process.env.SECRET_KEY 

export const generateToken = (payload) => {
    const tokenPayload = {
        ...payload,
        random: crypto.randomBytes(16).toString('hex')
    }
    return jwt.sign(tokenPayload, secret_key)
}