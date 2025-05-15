const express= require("express")
const router= express.Router()

const {resgisterUSer, loginUser, findUser, getUsers}=require("../Controllers/userControllers")

router.post("/register" , resgisterUSer)
 
router.post("/login" , loginUser)

router.get("/find/:userId" , findUser)
router.get("/" , getUsers)

module.exports=router