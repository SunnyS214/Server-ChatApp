const express= require("express")
const { findChat, findUserChats,createChats } = require("../Controllers/chatControllers")
const router= express.Router()

router.post("/" , createChats)  
router.get("/:userId" , findUserChats)
router.get("/find/:firstId/:secondId" , findChat)

module.exports=router