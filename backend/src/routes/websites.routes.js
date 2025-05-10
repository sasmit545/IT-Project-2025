import {
    openwebsitebyid,
    listAllWebsitesByUserId,
    createWebsite,
    updateWebsite
} from "../controllers/websites.controller.js";
import { Router } from "express";
import verifyJwt from "../middlewares/validateJwt.middleware.js"

const router = Router()

router.get("/website/:websiteid", verifyJwt, openwebsitebyid)
router.get("/websiteuser", verifyJwt, listAllWebsitesByUserId)
router.post("/websites", verifyJwt, createWebsite)
router.put("/updatewebsites/:websiteid", verifyJwt, updateWebsite)
