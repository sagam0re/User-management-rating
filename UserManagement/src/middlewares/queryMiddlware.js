exports.getQueryBody = async function (req, res, next) {
  const { upvote, downvote } = req.query;
  const { nickName } = req.body;
  if (!upvote && !downvote) {
    return res.status(400).send({ message: 'Should vote for someone' });
  }

  if (upvote && +upvote !== 1) {
    return res.send({ message: 'upvote or downvote with 1 point' });
  }
  if (downvote && +downvote !== 1) {
    return res.send({ message: 'upvote or downvote with 1 point' });
  }
  req.vote = { nickName, upvote, downvote };
  next();
};
