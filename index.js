require('dotenv').config(); // यह सबसे पहले होना चाहिए

const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoutes")
const chatRoute = require("./Routes/chatRoutes")
const messageRoute = require("./Routes/messageRoutes")



const port = process.env.PORT || 3000;
const uri = process.env.ATLAS_URL;

const app = express();

app.use(express.json());

// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173', // ✅ allow frontend
  credentials: true, // अगर cookie या authorization header भेज रहे हो
}));

app.use("/api/users" , userRoute )
app.use("/api/chats" , chatRoute )
app.use("/api/messages" , messageRoute )

app.get ('/' ,(req,res)=>{
    res.send("home ")
    console.log('home route')
} )

app.get ('/page' ,(req,res)=>{
    res.send("page ")
    console.log('page route')
} )

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});


mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('mongoDB connection established'))
.catch((error) => console.log('mongodb connection failed: ', error.message));
