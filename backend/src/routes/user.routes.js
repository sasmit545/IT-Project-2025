import { Router } from "express";
import { loginUser,createUser,logoutUser} from "../controllers/user.controller.js";
import verifyJwt from "../middlewares/validateJwt.middleware.js"
import Upload from "../middlewares/multer.middleware.js";
const router=Router()

router.route("/register").post(Upload.none(),createUser)

router.route("/login").post(Upload.none(),loginUser)

router.route("/logout").post(verifyJwt,Upload.none(),logoutUser)
export default router

