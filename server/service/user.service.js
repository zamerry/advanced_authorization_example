import db from '../database/db.js'
import bcrypt from 'bcryptjs'
import {v4} from 'uuid'
import MailService from "./mail.service.js";
import TokenService from "./token.service.js";
import UserDto from "../../dtos/user.dto.js";
import ApiError from "../../expceptions/api-error.js";
import tokenService from "./token.service.js";

class UserService {
    async registration(email, password) {

        const candidate = await db.query(
            'select * from users where email = $1', [email]
        )

        if (candidate.rows.length > 0) {
            throw ApiError.badRequest(`пользователь с почтовым индексом ${email} уже существует`)
        }

        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = v4()
        const user = await db.query(
            'insert into users (email, password, activationLink) values ($1, $2, $3) returning *',
            [email, hashPassword, activationLink]
        )
        await MailService.sendActivationMail(email, `${process.env.api_url}/auth/activate/${activationLink}`)

        const userDto = new UserDto(user.rows[0])
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }

    }

    async active(activationLink) {
        const user = await db.query(
            'select * from users where activationlink = $1', [activationLink]
        )

        if (user.rows.length <= 0) {
            throw ApiError.badRequest("нету ссылки для активации")
        }

        const userId = user.rows[0].id

        const activatedUserLink = await db.query(
            'update users set isactivated = true where id = $1 returning *', [userId]
        )

        return activatedUserLink.rows[0]

    }

    async login(email, password) {
        const isReal = await db.query(
            'select * from users where email = $1', [email]
        )

        if (!isReal.rows.length > 0) {
            throw (ApiError.badRequest("пользователя с такой почтой не существует"))
        }

        const user = isReal.rows[0]

        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            throw ApiError.badRequest("неккоректный пароль")
        }

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.unAuthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw ApiError.unAuthorizedError()
        }

        const user = await db.query(
            'select * from users where email = $1', [userData.email]
        )
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDto
        }

    }

    async getAllUsers() {
        const users = await db.query(
            'select * from users'
        )
        return users.rows
    }

}

export default new UserService()