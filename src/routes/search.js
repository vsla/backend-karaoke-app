const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const { q } = req.query;
  const response = await axios.get(
    "https://www.googleapis.com/youtube/v3/search",
    {
      params: {
        part: "snippet",
        type: "video",
        q,
        key: process.env.YOUTUBE_API_KEY,
      },
    }
  );
  res.json(response.data);
});

module.exports = router;
