const express = require("express");
const Party = require("../models/Party");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { getIO } = require("../socket");

// Create new party
router.post("/create", async (req, res) => {
  const code = uuidv4();
  const newParty = new Party({ code, videos: [] });
  const party = await newParty.save();
  res.json({ party });
});

// Get party by code
router.get("/:code", async (req, res) => {
  const { code } = req.params;
  const party = await Party.findOne({ code });
  if (!party) {
    return res.status(404).json({ message: "Festa não encontrada" });
  }
  res.json(party);
});

// List all parties (for admin panel)
router.get("/", async (req, res) => {
  const parties = await Party.find();
  res.json(parties);
});

// Add video to party
router.post("/:code/videos", async (req, res) => {
  const { code } = req.params;
  const { id, title, thumbnail, user } = req.body;
  const videoId = uuidv4();

  const party = await Party.findOne({ code });
  if (!party) {
    return res.status(404).json({ message: "Festa não encontrada" });
  }

  party.videos.push({ id, title, thumbnail, user, videoId });
  await party.save();

  getIO().to(code).emit("updateQueue", party.videos);

  res.json(party);
});

// Remove video from party
router.delete("/:code/videos/:videoId", async (req, res) => {
  const { code, videoId } = req.params;

  const party = await Party.findOne({ code });
  if (!party) {
    return res.status(404).json({ message: "Festa não encontrada" });
  }

  party.videos = party.videos.filter((video) => video.videoId !== videoId);
  await party.save();

  getIO().to(code).emit("updateQueue", party.videos);

  res.json(party);
});

// Update video order in party
router.put("/:code/videos", async (req, res) => {
  const { code } = req.params;
  const { videos } = req.body;

  const party = await Party.findOne({ code });
  if (!party) {
    return res.status(404).json({ message: "Festa não encontrada" });
  }

  party.videos = videos;
  await party.save();

  getIO().to(code).emit("updateQueue", party.videos);

  res.json(party);
});

module.exports = router;
