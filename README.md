# divelog-server-graphql

A GraphQL version of my [divelog-server-rest](https://github.com/btdrawer/divelog-server-rest) project, which was a REST API built using NodeJS. The functionality is mostly the same, but I have made some improvements which I may port back to the REST project eventually.

I learned about GraphQL and how to implement it into NodeJS from the Udemy course [The Modern GraphQL Bootcamp (with Node.js and Apollo)](https://www.udemy.com/course/graphql-bootcamp/).

I also learned about dataloaders, cursor-based pagination, and how to combine multiple resolvers from this course: [GraphQL Apollo Server with Node.js, MongoDB - GraphQL API](https://www.udemy.com/course/graphql-apollo-server-api-nodejs-mongodb/).

This version of the project is still based on MongoDB; in the future I plan to create another version using Prisma, which will therefore work with a number of relational and non-relational databases. I decided to build this MongoDB-specific one first as additional practice and evidence of my understanding of GraphQL.

## Requirements

-   NodeJS
-   NPM
-   MongoDB
-   Redis

## How to run

From the root folder, type `npm i` to install the necessary dependencies.

Add a `.env` file to the `config` folder, with the following variables:

-   `MONGODB_URL`: The URL of your MongoDB database.
-   `JWT_KEY`: The secret key that your JSON Web Tokens will be signed with.
-   `REDIS_HOST`: The URL of your Redis data store.
-   `REDIS_PORT`: The port that your Redis store is listening on.
-   `SERVER_PORT`: The port that the server should listen on.

Then, you can run the program by typing:
`npm start`

GraphQL playground will be available on localhost at `SERVER_PORT`. From there, you will have access to all possible mutations and queries.

## Unit tests

To run unit tests, add a `.test.env` file to the `config` folder with the variables `MONGODB_URL`, `JWT_KEY`, and `SERVER_PORT`, and then run:
`npm test`

You can also watch the tests:
`npm run test:watch`
