const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

// Example posts:
// const posts = {
//     'i45un4i': {
//         id: 'i45un4i',
//         title: 'post title',
//         comments: [
//             {id: '8gf5h9', content: 'comment'}
//         ]
//     },
//     '4w5t45': {
//         id: '4w5t45',
//         title: 'post title',
//         comments: [
//             {id: '09tjb9', content: 'comment'}
//         ]
//     }
// }

const handleEvent = ({ data, type }) => {
  if (type === "PostCreated") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
    console.log({ posts });
  }
  if (type === "CommentCreated") {
    const { id, postId, content, status } = data;

    posts[postId].comments.push({ id, content, status });
    // console.log({ posts });
    // console.log("comments: ", posts[postId].comments);
  }
  if (type === "CommentUpdated") {
    const { id, content, status, postId } = data;
    const post = posts[postId];

    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent({ type, data });

  console.log({ posts });

  res.send({});
});

// app.post("/events", (req, res) => {
//   console.log(req.body.type);

//   res.send({});
// });

app.listen(4002, async () => {
  console.log("Listening on 4002");

  try {
    const res = await axios.get("http://localhost:4005/events");
    for (let event of res.data) {
      console.log("Processing event:", event.type);

      const { type, data } = event;

      handleEvent({ type, data });
    }
  } catch (e) {
    console.log({ e });
  }
});
