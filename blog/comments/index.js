const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());

app.use(bodyParser.json());

// this data structure is optimized for posts lookups
// by post id
const commentsByPostId = {
  "35p5pj": [{ id: "j325", content: "great post" }],
  "43fg43": [{ id: "f453", content: "another great post" }],
};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");

  const { content } = req.body;

  const postId = req.params.id;

  const comments = commentsByPostId[postId] || [];

  const amendedComments = comments.concat([
    { id: commentId, content, status: "pending" },
  ]);

  commentsByPostId[postId] = amendedComments;

  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId,
      status: "pending",
    },
  });

  res.status(201).send(commentsByPostId);
});

app.post("/events", async (req, res) => {
  console.log("Received Event", req.body.type);
  const { type, data } = req.body;

  if (type === "CommentModerated") {
    // console.log({ data });

    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;

    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("listening on 4001");
});
