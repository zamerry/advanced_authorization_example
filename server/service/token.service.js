import jwt from 'jsonwebtoken'
import db from '../database/db.js'

class TokenService {
    generateTokens(payload) {

        const accessToken = jwt.sign(payload, process.env.secret_access_key, {expiresIn: "30m"})
        const refreshToken = jwt.sign(payload, process.env.secret_refresh_key, {expiresIn: "30d"})

        return {accessToken, refreshToken}

    }

    async saveToken(userId, refreshToken) {
        const tokenData = await db.query(
            'select * from tokens where id = $1', [userId]
        )

        if (tokenData.rows.length > 0) {
            const updateToken = await db.query(
                'update tokens set refreshtoken = $1 where id = $2 returning *', [refreshToken, userId]
            )
            return updateToken.rows[0]
        }

        const createToken = await db.query(
            'insert into tokens (username, refreshtoken) values ($1, $2) returning *', [userId, refreshToken]
        )
        return createToken.rows[0]
    }

    async removeToken(refreshToken) {
        const tokenData = await db.query(
            'delete from tokens where refreshtoken = $1', [refreshToken]
        )
        return tokenData.rows[0]
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.secret_access_key)
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.secret_refresh_key)
            return userData
        } catch (e) {
            return null
        }
    }

    async findToken(refreshToken) {
        const tokenData = await db.query(
            'select * from tokens where refreshtoken = $1', [refreshToken]
        )
        return tokenData.rows[0]
    }

}

export default new TokenService()