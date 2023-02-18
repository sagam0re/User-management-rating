function paginationMiddleware(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const docsLength = await model.countDocuments().exec();

    let profiles = {};

    if (endIndex < docsLength) {
      profiles.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      profiles.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      const usersInfo = await model
        .find()
        .sort({ _id: 1 })
        .limit(limit)
        .skip(startIndex)
        .exec();
      profiles.users = usersInfo.map((e) => {
        const { nickName, fullName, deleted } = e;
        if (deleted) {
          return;
        }
        return { nickName, fullName };
      });
      profiles.users.sort();
      const index = profiles.users.indexOf(undefined);
      profiles.users.splice(index);
      res.paginatedResults = profiles;
      next();
    } catch (err) {
      console.log(err);
      res.json({ message: err.message });
    }
  };
}

module.exports = paginationMiddleware;
