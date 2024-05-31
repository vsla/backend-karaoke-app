const express = require("express");
const Party = require("../models/Party");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// Cria nova festa
router.post("/create", async (req, res) => {
  const code = uuidv4();
  const newParty = new Party({ code, videos: [] });
  const party = await newParty.save();
  res.json({ party });
});

// Obter festa por código
router.get("/:code", async (req, res) => {
  const { code } = req.params;
  const party = await Party.findOne({ code });
  if (!party) {
    return res.status(404).json({ message: "Festa não encontrada" });
  }

  res.json(party);
});

// Listar todas as festas (para o painel de administração)
router.get("/", async (req, res) => {
  const parties = await Party.find();
  res.json(parties);
});

// Adicionar vídeo à festa
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

  res.json(party);
});

// Remover vídeo da festa
router.delete("/:code/videos/:videoId", async (req, res) => {
  const { code, videoId } = req.params;

  const party = await Party.findOne({ code });
  if (!party) {
    return res.status(404).json({ message: "Festa não encontrada" });
  }

  party.videos = party.videos.filter((video) => video.videoId !== videoId);
  await party.save();

  res.json(party);
});

// Atualizar ordem dos vídeos na festa
router.put("/:code/videos", async (req, res) => {
  const { code } = req.params;
  const { videos } = req.body; // [{ id, title, thumbnail, user }]

  const party = await Party.findOne({ code });
  if (!party) {
    return res.status(404).json({ message: "Festa não encontrada" });
  }

  party.videos = videos;
  await party.save();

  res.json(party);
});

module.exports = router;
