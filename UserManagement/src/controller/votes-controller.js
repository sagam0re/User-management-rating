const CustomError = require('../errors/error');
const PollingService = require('../services/polling-service');

const pollingService = new PollingService();

class VotesController {
  voting = async (req, res) => {
    try {
      const { nickName: nick } = req.userData;
      const { nickName, upvote, downvote } = req.vote;

      if (upvote) {
        const data = await pollingService.setVote(upvote, nick, nickName);
        res.send({ data: data });
      } else if (downvote) {
        const data = await pollingService.setVote(-downvote, nick, nickName);
        res.send({ data: data });
      }
    } catch (err) {
      if (err instanceof CustomError) {
        return res.status(err.code).send({ message: err.message });
      }
      res.status(500).send({ message: 'Opss... Something went wrong!' });
    }
  };
  getTotalVotes = async (req, res) => {
    const { nickName } = req.params;
    const votes = await pollingService.totalVote(nickName);
    res.send({ Total_votes: votes });
  };
}

module.exports = VotesController;
