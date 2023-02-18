const { model } = require('../model/user-profile-model');
const CustomError = require('../errors/error');
const { modelVote } = require('../model/vote-model');

class PollingService {
  constructor() {}
  async setVote(vote, voter, votedFor) {
    const existedUser = await model.findOne({ nickName: votedFor });
    if (!existedUser) {
      throw new CustomError(
        'The user you want to vote for is not registered',
        400
      );
    }
    if (voter === votedFor) {
      throw new CustomError('Can not vote for yourself', 403);
    }
    if (!vote) {
      throw new CustomError('Should vote for someone', 400);
    }
    const voterInfo = await modelVote.find({ voter });
    let voteDocs;
    const hour = 3600000;

    voterInfo.forEach((e) => {
      if (e.votedFor === votedFor) {
        throw new CustomError('can not vote for the same persons', 403);
      }
      if (e.date + hour >= Date.now()) {
        throw new CustomError(
          'It is less than 1 hour, since you have been last voted',
          403
        );
      } else {
        return (voteDocs = e);
      }
    });

    if (!voteDocs) {
      return await modelVote.create({
        vote,
        voter,
        votedFor,
      });
    }

    return await this._updateVote(vote, voter, votedFor);
  }

  async _updateVote(voteNum, voter, votedFor) {
    let votedUser = await modelVote.findOne({ votedFor });
    if (!votedUser) {
      return await modelVote.create({
        vote: voteNum,
        voter,
        votedFor,
      });
    }
    let { vote } = votedUser;
    vote += +voteNum;

    return await modelVote.updateOne(
      { voter },
      {
        vote,
        voter,
        votedFor,
        date: Date.now(),
      },
      { upsert: true }
    );
  }
  async totalVote(votedFor) {
    const userProf = await modelVote.find({ votedFor });
    const totalVote = userProf.reduce((total, curr) => (total += curr.vote), 0);

    return totalVote;
  }
}

module.exports = PollingService;
