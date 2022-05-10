import React from "react";

const getComment = (content, status) => {
  if (status === "approved") return content;
  if (status === "pending") return "This comment is awaiting moderation";
  if (status === "rejected") return "This comment has been rejected";
};

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    return (
      <li key={comment.id}>{getComment(comment.content, comment.status)}</li>
    );
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
