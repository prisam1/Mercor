const express  = require("express")
const router =express.Router()
const {convertSpeechToText,generateSpeechFromText,processGPT,joinZoomMeeting}= require("../Controller/Zoom_bot")



router.post("/speechToText",convertSpeechToText)
router.post("/textToSpeech",generateSpeechFromText)
router.post("/processGPT",processGPT)
router.post('/joinZoomMeeting',joinZoomMeeting)

router.all("/*",(req,res)=>{res.status(400).send({status:false,message:"Invalid path params"})})

module.exports = router  