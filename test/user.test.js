const supertest = require("supertest");
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const typeDefs = require("../src/schema");
const resolvers = require("../src/resolvers");
const mongoose = require("mongoose");
const User = require("../src/models/User");

// Setup Apollo Server with Express for testing
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://mongo:27017/testDB",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  await server.start();
  server.applyMiddleware({ app });
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe("User API Tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should create a new user successfully", async () => {
    const mutation = `
      mutation {
        createUser(email: "test1@test.com", firstName: "Test", lastName: "User", gender: "non-binary") {
          id
          email
          firstName
          lastName
          gender
          createdAt
        }
      }
    `;
    const response = await supertest(app)
      .post(server.graphqlPath)
      .send({ query: mutation });
    expect(response.body.data.createUser.email).toBe("test1@test.com");
  });

  it("should fail to create a user with an existing email", async () => {
    await new User({
      email: "test2@test.com",
      firstName: "Test",
      lastName: "User",
      gender: "male",
    }).save();
    const mutation = `
      mutation {
        createUser(email: "test2@test.com", firstName: "Test", lastName: "User", gender: "male") {
          id
          email
        }
      }
    `;
    const response = await supertest(app)
      .post(server.graphqlPath)
      .send({ query: mutation });
    expect(response.body.errors).not.toBeUndefined();
  });

  it("should update an existing user successfully", async () => {
    const user = await new User({
      email: "test3@test.com",
      firstName: "Test",
      lastName: "User",
      gender: "female",
    }).save();
    const mutation = `
      mutation {
        updateUser(id: "${user.id}", firstName: "Updated") {
          id
          firstName
        }
      }
    `;
    const response = await supertest(app)
      .post(server.graphqlPath)
      .send({ query: mutation });
    expect(response.body.data.updateUser.firstName).toBe("Updated");
  });

  it("should fail to update a user with an invalid ID", async () => {
    const mutation = `
      mutation {
        updateUser(id: "invalidId", firstName: "Updated") {
          id
          firstName
        }
      }
    `;
    const response = await supertest(app)
      .post(server.graphqlPath)
      .send({ query: mutation });
    expect(response.body.errors).not.toBeUndefined();
  });

  it("should fail to add a user as a friend to themselves", async () => {
    const user = await new User({
      email: "test6@test.com",
      firstName: "Test",
      lastName: "User",
      gender: "non-binary",
    }).save();
    const mutation = `
      mutation {
        addFriend(userId: "${user.id}", friendId: "${user.id}") {
          id
        }
      }
    `;
    const response = await supertest(app)
      .post(server.graphqlPath)
      .send({ query: mutation });
    expect(response.body.errors).not.toBeUndefined();
  });

  it("should fail to add an existing friend", async () => {
    const user1 = await new User({
      email: "test7@test.com",
      firstName: "Test",
      lastName: "User",
      gender: "male",
    }).save();
    const user2 = await new User({
      email: "test8@test.com",
      firstName: "Friend",
      lastName: "User",
      gender: "female",
    }).save();
    user1.friends.push(user2.id);
    await user1.save();
    const mutation = `
      mutation {
        addFriend(userId: "${user1.id}", friendId: "${user2.id}") {
          id
        }
      }
    `;
    const response = await supertest(app)
      .post(server.graphqlPath)
      .send({ query: mutation });
    expect(response.body.errors).not.toBeUndefined();
  });

  it("should list users with pagination", async () => {
    const users = [
      {
        email: "user1@test.com",
        firstName: "User1",
        lastName: "Test",
        gender: "male",
      },
      {
        email: "user2@test.com",
        firstName: "User2",
        lastName: "Test",
        gender: "female",
      },
      {
        email: "user3@test.com",
        firstName: "User3",
        lastName: "Test",
        gender: "non-binary",
      },
    ];
    await User.insertMany(users);
    const query = `
      query {
        users(pageSize: 2) {
          cursor
          hasMore
          users {
            id
            email
          }
        }
      }
    `;
    const response = await supertest(app)
      .post(server.graphqlPath)
      .send({ query });
    expect(response.body.data.users.users.length).toBe(2);
    expect(response.body.data.users.hasMore).toBe(true);
  });

  it("should list the next page of users using a cursor", async () => {
    const users = [
      {
        email: "user4@test.com",
        firstName: "User4",
        lastName: "Test",
        gender: "male",
      },
      {
        email: "user5@test.com",
        firstName: "User5",
        lastName: "Test",
        gender: "female",
      },
      {
        email: "user6@test.com",
        firstName: "User6",
        lastName: "Test",
        gender: "non-binary",
      },
    ];
    await User.insertMany(users);
    let query = `
      query {
        users(pageSize: 2) {
          cursor
          hasMore
          users {
            id
            email
          }
        }
      }
    `;
    let response = await supertest(app)
      .post(server.graphqlPath)
      .send({ query });
    const cursor = response.body.data.users.cursor;
    query = `
      query {
        users(pageSize: 2, after: "${cursor}") {
          cursor
          hasMore
          users {
            id
            email
          }
        }
      }
    `;
    response = await supertest(app).post(server.graphqlPath).send({ query });
    expect(response.body.data.users.users.length).toBe(1);
    expect(response.body.data.users.hasMore).toBe(false);
  });
});
