
require("dotenv").config()
const express = require("express")
const urlRoute = require("./routes/url")
const { connectToMongoDb } = require("./connection");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const { checkForAuthentication,restrictTo } = require('./middleware/auth')
const app = express()
const PORT = process.env.PORT;
const URL = require("./models/url")
const userRoute = require('./routes/user')
const jwt=require('jsonwebtoken')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

const mongoUrl = process.env.MONGODB_URL
connectToMongoDb(mongoUrl)
    .then(() => console.log("mongodb connected"))

app.use(cookieParser());


app.use(checkForAuthentication)
app.use("/url", urlRoute)
app.use('/user', userRoute)



app.get('/checkAuth', async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        console.log('No session token found in cookie.');
        return res.status(401).json({ isAuthenticated: false, message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log('Token verified:', decoded);
        res.status(200).json({ isAuthenticated: true, userId: decoded.userId ,role:decoded.role,email:decoded.email});
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    })
        res.status(401).json({ isAuthenticated: false, message: 'Unauthorized: Invalid token' });
    }

})


app.delete("/delete",restrictTo(["ADMIN","NORMAL"]), async (req, res) => {
    await URL.deleteMany({})
    res.json({ msg: "history deleted" })
})

app.get("/", (req, res) => {
    return res.json({ msg: "nothing" })
})

app.get("/test", restrictTo(["NORMAL","ADMIN"]), async (req, res) => {
    if (!req.user) return res.json([])
    const allUrls = await URL.find({ createdBy: req.user._id })
    return res.json(allUrls)
})

app.get("/admin/urls", restrictTo(["ADMIN"]), async (req, res) => {
  try {
    const allUrls = await URL.find({}).populate("createdBy", "email role");
    return res.json({ urls: allUrls });
  } catch (error) {
    console.error("Error fetching all URLs:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

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

    if (!entry) {
        return res.json({ msg: "no short url found" })
    }
    res.redirect(entry.redirectUrl)
})


app.listen(PORT, () => console.log("server started"))

