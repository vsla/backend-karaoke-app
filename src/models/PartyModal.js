const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({
  code: { type: String, unique: true },
  videos: [
    {
      id: String,
      title: String,
      thumbnail: String,
      user: String,
      videoId: String
    },
  ],
});

const Party = mongoose.model("Party", partySchema);

module.exports = Party;
