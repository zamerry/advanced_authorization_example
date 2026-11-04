import ApiError from "../expceptions/api-error.js";
import TokenService from "../server/service/token.service.js";
import tokenService from "../server/service/token.service.js";

const onlyAuthorizationUsers = (req, res, next) => {
    try {

        const getToken = req.headers.authorization

        if (!getToken) {
            return ApiError.unAuthorizedError()
        }

        const accessToken = getToken.split(" ")[1]

        if (!accessToken) {
            return next(ApiError.unAuthorizedError())
        }

        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData) {
            return next(ApiError.unAuthorizedError())
        }

        req.user = userData
        next()

    }   catch (e) {
        return next(ApiError.unAuthorizedError())
    }
}

export default onlyAuthorizationUsers