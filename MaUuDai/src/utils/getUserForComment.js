function getUserForComment(userCommentId, users) {
    const matchedUser = users.find((user) => user.uid === userCommentId);
    return matchedUser || null;
}

export default getUserForComment;
