import { Router } from "express";
import { loginUser,createUser } from "../controllers/user.controller.js";
import verifyJwt from "../middlewares/validateJwt.middleware.js"
import Upload from "../middlewares/multer.middleware.js";
const router=Router()

router.route("/register").post(Upload.none(),createUser)

router.route("/login",Upload.none()).post(loginUser)

export default router

