const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const { q, pageToken } = req.query; // Capture query and pageToken from the request
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          type: "video",
          q,
          key: process.env.YOUTUBE_API_KEY,
          maxResults: 10,
          pageToken, // Pass the pageToken if provided
        },
      }
    );

    // Log the response for debugging purposes (optional)
    console.log(response.data);

    // Respond with the data
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from YouTube API:", error.message);
    res.status(500).json({ error: "Failed to fetch data from YouTube API" });
  }
});

module.exports = router;
