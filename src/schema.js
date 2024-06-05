const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    gender: String!
    imageUrl: String
    createdAt: String!
    friends: [User!]!
  }

  type Query {
    users(pageSize: Int, after: String): UserConnection!
  }

  type UserConnection {
    cursor: String!
    hasMore: Boolean!
    users: [User]!
  }

  type Mutation {
    createUser(
      email: String!
      firstName: String!
      lastName: String!
      gender: String!
      imageUrl: String
    ): User!
    addFriend(userId: ID!, friendId: ID!): User!
    updateUser(
      id: ID!
      email: String
      firstName: String
      lastName: String
      gender: String
      imageUrl: String
    ): User!
  }
`;

module.exports = typeDefs;
