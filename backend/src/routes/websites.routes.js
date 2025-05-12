import {
    openwebsitebyid,
    listAllWebsitesByUserId,
    createWebsite,
    updateWebsite
} from "../controllers/websites.controller.js";
import { Router } from "express";
import verifyJwt from "../middlewares/validateJwt.middleware.js"
import upload from "../middlewares/multer.middleware.js";
const router = Router()

router.get("/website/:websiteid", verifyJwt, openwebsitebyid)
router.get("/websiteuser", verifyJwt, listAllWebsitesByUserId)
router.post("/websites", verifyJwt,upload.none(), createWebsite)
router.patch("/updatewebsites/:websiteid", verifyJwt,upload.none(), updateWebsite)
export default router