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

- Copy `.env.example` to `.env` and adjust the variables according to your environment.

4. Start the database and the application with Docker:

## Usage

Access `http://localhost:4000` in your browser to interact with the GraphQL server via Apollo Studio.

## Endpoints

- `POST /` - for GraphQL queries and mutations.

## Features

- **Create User**: Allows a new user to join the system.
- **List Users**: Ability to list all users with pagination options.
- **Add Friend**: Users can add other users to their friend list.
- **Update User**: Users can update their personal information.

## Additional Information

Ensure that MongoDB service is up and running if you choose not to use Docker. For local MongoDB setup, ensure your `.env` configuration points to your local MongoDB instance.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.
