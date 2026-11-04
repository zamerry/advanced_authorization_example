import {Router} from "express"
import UserController from "../controller/user.controller.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const router = new Router()

import {body} from "express-validator";

router.post('/registration',
    body('email').isEmail(),
    UserController.registration)
router.post('/login', body('email').isEmail(),
    UserController.login)
router.post('/logout', UserController.logout)
router.get('/activate/:link', UserController.activatedUsers)
router.get('/refresh', UserController.refresh)
router.get('/users', authMiddleware, UserController.getUsers)

export default router