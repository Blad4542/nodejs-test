const User = require("./models/User");

const resolvers = {
  Query: {
    users: async (parent, { pageSize = 10, after }, context, info) => {
      const users = await User.find().limit(pageSize).sort({ _id: -1 }).exec();

      const cursor = users.length > 0 ? users[users.length - 1]._id : "0";
      const hasMore = users.length < pageSize ? false : true;

      return {
        cursor,
        hasMore,
        users,
      };
    },
  },
  Mutation: {
    createUser: async (_, { email, firstName, lastName, gender, imageUrl }) => {
      const newUser = new User({
        email,
        firstName,
        lastName,
        gender,
        imageUrl,
      });
      return newUser.save();
    },
  },
};

module.exports = resolvers;
