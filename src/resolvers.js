const { ObjectId } = require("mongoose").Types;
const User = require("./models/User");

const resolvers = {
  Query: {
    users: async (_, { pageSize = 10, after }) => {
      let users;
      if (after) {
        users = await User.find({ _id: { $gt: new ObjectId(after) } }).limit(
          pageSize + 1
        );
      } else {
        users = await User.find().limit(pageSize + 1);
      }
      const hasNextPage = users.length > pageSize;
      const edges = hasNextPage ? users.slice(0, -1) : users;

      return {
        cursor: edges.length ? edges[edges.length - 1].id : null,
        hasMore: hasNextPage,
        users: edges,
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
      await newUser.save();
      return newUser;
    },
    addFriend: async (_, { userId, friendId }) => {
      if (userId === friendId) {
        throw new Error("Users cannot add themselves as friends");
      }

      // Convert IDs to ObjectId
      const userObjectId = new ObjectId(userId);
      const friendObjectId = new ObjectId(friendId);

      const user = await User.findById(userObjectId);
      const friend = await User.findById(friendObjectId);
      if (!user || !friend) {
        throw new Error("One or both users not found");
      }

      if (user.friends.includes(friendObjectId)) {
        throw new Error("This user is already a friend");
      }

      user.friends.push(friendObjectId);
      await user.save();

      return user;
    },
    updateUser: async (
      _,
      { id, email, firstName, lastName, gender, imageUrl }
    ) => {
      const updatedUser = await User.findByIdAndUpdate(
        new ObjectId(id),
        { email, firstName, lastName, gender, imageUrl },
        { new: true }
      );
      return updatedUser;
    },
  },
};

module.exports = resolvers;
