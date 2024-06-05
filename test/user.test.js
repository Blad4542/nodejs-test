const supertest = require("supertest");
const { ApolloServer } = require("apollo-server");
const typeDefs = require("../src/schema");
const resolvers = require("../src/resolvers");

describe("User API Tests", () => {
  let server;
  let request;

  beforeAll(() => {
    server = new ApolloServer({ typeDefs, resolvers });
    return server.listen({ port: 4001 }).then(({ url }) => {
      request = supertest(url);
    });
  });

  afterAll(() => {
    server.stop();
  });

  it("should create a user", async () => {
    const mutation = `
      mutation {
        createUser(email: "test@test.com", firstName: "Test", lastName: "User", gender: "non-binary") {
          id
          email
        }
      }
    `;
    const response = await request.post("").send({ query: mutation });
    expect(response.body.data.createUser.email).toBe("test@test.com");
  });
});
