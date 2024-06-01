const express = require("express");
const Party = require("../models/PartyModal");
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

// // Play video
// router.post("/:code/play", async (req, res) => {
//   const { code } = req.params;
//   const party = await Party.findOne({ code });
//   if (!party) {
//     return res.status(404).json({ message: "Festa não encontrada" });
//   }

//   party.isPlaying = true;
//   await party.save();

//   getIO().to(code).emit("playVideo", party);

//   res.json(party);
// });

// // Pause video
// router.post("/:code/pause", async (req, res) => {
//   const { code } = req.params;
//   const party = await Party.findOne({ code });
//   if (!party) {
//     return res.status(404).json({ message: "Festa não encontrada" });
//   }

//   party.isPlaying = false;
//   await party.save();

//   getIO().to(code).emit("pauseVideo", party);

//   res.json(party);
// });

// Next video
router.post("/:code/next", async (req, res) => {
  const { code } = req.params;
  const party = await Party.findOne({ code });
  if (!party) {
    return res.status(404).json({ message: "Festa não encontrada" });
  }

  const { videos } = party;

  if (videos.length > 0) {
    const hasNextVideo = videos.length > 2;

    if (hasNextVideo) {
      party.videos = videos.slice(1);
    }

    if (videos.length === 1) {
      party.videos = [];
      party.isPlaying = false;
    }

    await party.save();

    getIO().to(code).emit("nextVideo", party);
    getIO().to(code).emit("updateQueue", party.videos);

    res.json(party);
  } else {
    res.json({ party, message: "don't have a next video" });
  }
});

module.exports = router;
