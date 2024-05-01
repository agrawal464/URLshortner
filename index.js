const express = require("express");
const path = require('path');
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");

const URL = require('./models/url');
const app = express();
const PORT = 8001;

// Connect to MongoDB
connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

// Set up view engine and views directory
app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

// URL route
app.use("/url", urlRoute);
app.use("/",staticRoute);

// Route to handle redirection based on shortId
app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );
    res.redirect(entry.redirectURL);
});

// Start the server
app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));