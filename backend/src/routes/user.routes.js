import {Router} from "express"
import {registerUser} from "../controller/user.controller.js"
import {upload} from "../middleware/multer.middleware.js"
const router=Router()


// router.route("/checkworking").get(
//     (req,res)=>{
//         res.json({
//             message:"Hello from user routes",
//             user:req.user
//         })
//     }
// )// wokringggg
router.route("/register").post(upload.none(),registerUser)



export default router 