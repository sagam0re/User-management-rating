const VotesController = require('../controller/votes-controller');
const { getQueryBody } = require('../middlewares/queryMiddlware');
const jwtMiddleware = require('../middlewares/jwtoken');

const votesController = new VotesController();

exports.voteRouter = function (app) {
  app.post('/votes', jwtMiddleware, getQueryBody, votesController.voting);
  app.get('/votes/:nickName', votesController.getTotalVotes);
};
