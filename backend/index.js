
require("dotenv").config()
const express = require("express")
const urlRoute = require("./routes/url")
const { connectToMongoDb } = require("./connection");
const cors = require('cors');

const app = express()
const PORT = process.env.PORT;
const URL = require("./models/url")

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())

connectToMongoDb(process.env.MONGODB_URL)
.then(() => console.log("mongodb connected"))



app.use("/url", urlRoute)

app.get("/delete", async (req,res)=>{
     await URL.deleteMany({}) 
     res.json({msg:"history deleted"})
})

app.get("/", (req,res)=>{
    return res.json({msg:"nothing"})
})

app.get("/test", async(req,res)=>{
    const allUrls = await URL.find({})
    return res.json(allUrls)
})

app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId
    const entry = await URL.findOneAndUpdate({
        shortId,
    },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        }) 
    
    if(!entry){
      return  res.json({msg:"no short url found"})
    }    
    res.redirect(entry.redirectUrl)
})


app.listen(PORT, () => console.log("server started"))

