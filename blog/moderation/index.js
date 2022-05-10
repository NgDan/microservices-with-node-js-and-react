const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";
    const moderatedComment = {
      ...data,
      status,
    };

    await axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: moderatedComment,
    });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("listening on port 4003...");
});
