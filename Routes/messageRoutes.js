const express = require("express")
const { getMessage, createMessage } = require("../Controllers/messageControllers")
const router= express.Router()

router.post("/" , createMessage)
router.get("/:chatId" , getMessage)

module.exports= router