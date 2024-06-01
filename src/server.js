require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socket = require("./socket");

const searchRoutes = require("./routes/search");
const partyRoutes = require("./routes/party");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/search", searchRoutes);
app.use("/api/party", partyRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    const server = http.createServer(app);
    const io = socket.init(server);

    io.on("connection", (socket) => {
      console.log("Client connected");
      socket.on("joinParty", (partyCode) => {
        socket.join(partyCode);
      });
    });

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Connection error", err);
  });
