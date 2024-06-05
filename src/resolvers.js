const User = require("./models/User");

const resolvers = {
  Query: {
    users: async (_, { pageSize = 10, after }) => {
      let users;
      if (after) {
        users = await User.find({ _id: { $gt: after } }).limit(pageSize + 1);
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

      // Find both users to ensure they exist
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);
      if (!user || !friend) {
        throw new Error("One or both users not found");
      }

      // Check if the friend is already in the user's friends list
      if (user.friends.includes(friendId)) {
        throw new Error("This user is already a friend");
      }

      // Add friend to the user's friends list
      user.friends.push(friendId);
      await user.save();

      return user; // Return the updated user
    },
  },
  updateUser: async (
    _,
    { id, email, firstName, lastName, gender, imageUrl }
  ) => {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { email, firstName, lastName, gender, imageUrl },
      { new: true }
    );
    return updatedUser;
  },
};

module.exports = resolvers;
