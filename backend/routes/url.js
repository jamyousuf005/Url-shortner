const express=require("express")
const {handleGenerateNewShortUrl,handleGetAnalytics}=require("../controllers/url")
const { restrictTo, checkForAuthentication } = require('../middleware/auth')

const router = express.Router()

router.post("/",checkForAuthentication,restrictTo(["NORMAL","ADMIN"]),handleGenerateNewShortUrl)

router.get("/analytics/:shortId", handleGetAnalytics)


module.exports=router