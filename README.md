# NodeJS Test

## Description

This project is a GraphQL API for managing users and their friendships. It allows users to create accounts, update information, add friends, and list all users with pagination.

## Requirements

- Node.js
- Graphql
- npm
- Docker (optional, but recommended for running MongoDB)

## Installation

1. Clone this repository

2. Install dependencies

3. Set up environment variables:

4. Start the database and the application with Docker: docker-compose up --build

5. To run unit test use this command in other terminal: docker exec -it graphql_app /bin/bash

6. Then run npm run test

## Usage

Access `http://localhost:4000` in your browser to interact with the GraphQL server via Apollo Studio.

## Endpoints

- `POST /` - for GraphQL queries and mutations.

# Create a new user

mutation {
createUser(
email: "user1@test.com",
firstName: "User",
lastName: "One",
gender: "non-binary",
imageUrl: "http://example.com/image1.jpg"
) {
id
email
firstName
lastName
gender
imageUrl
createdAt
}
}

# Create another user

mutation {
createUser(
email: "user2@test.com",
firstName: "User",
lastName: "Two",
gender: "female",
imageUrl: "http://example.com/image2.jpg"
) {
id
email
firstName
lastName
gender
imageUrl
createdAt
}
}

# List users with pagination

query {
users(pageSize: 2) {
cursor
hasMore
users {
id
email
firstName
lastName
gender
imageUrl
createdAt
}
}
}

# Add a friend

# Make sure to replace USER_ID_1 and USER_ID_2 with the actual IDs obtained from the list users query

mutation {
addFriend(userId: "USER_ID_1", friendId: "USER_ID_2") {
id
friends {
id
email
firstName
lastName
}
}
}

# Update user information

# Make sure to replace USER_ID with the actual ID of the user you want to update

mutation {
updateUser(
id: "USER_ID",
email: "updateduser@test.com",
firstName: "Updated",
lastName: "User",
gender: "male",
imageUrl: "http://example.com/updated-image.jpg"
) {
id
email
firstName
lastName
gender
imageUrl
createdAt
}
}

## Features

- **Create User**: Allows a new user to join the system.
- **List Users**: Ability to list all users with pagination options.
- **Add Friend**: Users can add other users to their friend list.
- **Update User**: Users can update their personal information.

## Additional Information

Ensure that MongoDB service is up and running if you choose not to use Docker. For local MongoDB setup, ensure your `.env` configuration points to your local MongoDB instance.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.
