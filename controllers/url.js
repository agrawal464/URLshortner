const URL = require('../models/url');
const shortid = require("shortid");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    // Check if the request contains a URL
    if (!body.url) return res.status(400).json({ error: "URL is required" });
    
    // Generate a new short ID using shortid
    const shortID = shortid();
    
    // Create a new URL entry in the database
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [], // Initialize visit history as an empty array
    });
    
    // Render the "home" view with the generated short ID
    return res.render("home", {
        id: shortID,
    });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    // Find the URL entry corresponding to the provided short ID
    const result = await URL.findOne({ shortId });
    
    // Return analytics data including total clicks and visit history
    return res.json({
        totalClicks: result.visitHistory.length, // Calculate total clicks
        analytics: result.visitHistory, // Return visit history
    });
}

module.exports = { 
    handleGenerateNewShortURL,
    handleGetAnalytics,
}
