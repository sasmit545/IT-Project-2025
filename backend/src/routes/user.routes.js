import { Router } from "express";
import { loginUser,createUser,logoutUser,sendEmailForgotPassword,resetPassword} from "../controllers/user.controller.js";
import verifyJwt from "../middlewares/validateJwt.middleware.js"
import Upload from "../middlewares/multer.middleware.js";
import { passwordForgotHelper } from "../utils/email.utils.js";
const router=Router()

router.route("/register").post(Upload.none(),createUser)

router.route("/login").post(Upload.none(),loginUser)

router.route("/logout").post(verifyJwt,Upload.none(),logoutUser)
router.route("/forgotpassword").post(Upload.none(),sendEmailForgotPassword)
router.route("/setpassword").patch(Upload.none(),resetPassword)
export default router

