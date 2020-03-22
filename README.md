# divelog-server-graphql

A GraphQL implementation of my [divelog-server-rest](https://github.com/btdrawer/divelog-server-rest) project, which was a REST API built using NodeJS.

I learned about GraphQL and how to implement it into NodeJS from the Udemy course [The Modern GraphQL Bootcamp (with Node.js and Apollo)](https://www.udemy.com/course/graphql-bootcamp/).

This version of the project is still based on MongoDB; in the future I plan to create another version using Prisma, which will therefore work with a number of relational and non-relational databases. I decideed to build this MongoDB-specific one first as additional practice and evidence of my understanding of GraphQL.

## Requirements

- NodeJS
- NPM
- MongoDB
- Redis (for PubSub)

## How to run

From the root folder, type `npm i` to install the necessary dependencies.

Add a `.env` file to the root folder, with the following variables:

- `MONGODB_URL`: The URL of your MongoDB database.
- `JWT_KEY`: The secret key that your JSON Web Tokens will be signed with.
- `REDIS_HOST`: The URL of your Redis data store.
- `REDIS_PORT`: The port that your Redis store is listening on.
- `SERVER_PORT`: The port that the server should listen on.

Then, you can run the program by typing:
`npm start`

Unit tests coming soon
