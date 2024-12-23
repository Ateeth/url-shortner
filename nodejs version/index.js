const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 8001;
var cors = require("cors");

app.use(cors({ origin: "*" }));
connectToMongoDB("mongodb://localhost:27017/short-url-nodejs").then(() => {
  console.log("Mongodb connected");
});

app.use(express.json());

app.use("/url", urlRoute);

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get("/socket.io/*", (req, res) => {
  res.status(404).send("Socket.IO endpoint not implemented");
});

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  console.log(entry);
  res.redirect(entry.redirectUrl);
});
app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
