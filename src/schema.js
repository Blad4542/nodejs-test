const { gql } = require("apollo-server");
// Define the schema
const typeDefs = gql`
  type User {
    id: ID!
    firtsName: String!
    lastName: String!
    email: String!
    gender: String!
    imageUrl: String!
    createdAt: String!
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
  }
`;

module.exports = typeDefs;
