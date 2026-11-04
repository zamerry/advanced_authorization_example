import db from '../database/db.js'
import UserService from "../service/user.service.js";
import dotenv from 'dotenv'
import {validationResult} from "express-validator";
import ApiError from "../../expceptions/api-error.js";
import userService from "../service/user.service.js";

dotenv.config()

class UserController {
    async registration(req, res, next) {
        try {

            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('ошибка при валидации'), errors.array())
            }

            const {email, password} = req.body

            const userData = await UserService.registration(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)

        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body

            const userData = await UserService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)

        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies

            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)

        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await UserService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getUsers(req, res) {
        try {
            const users = await UserService.getAllUsers()
            return res.json(users)
        } catch (e) {

        }
    }

    async activatedUsers(req, res, next) {
        try {
            const activationLink = req.params.link
            await UserService.active(activationLink)
            return res.redirect(process.env.client_url)

        } catch (e) {
            next(e)
        }
    }


}

export default new UserController()