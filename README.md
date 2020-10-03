# divelog-server-graphql

A GraphQL version of my [divelog-server-rest](https://github.com/btdrawer/divelog-server-rest) project, which was a REST API built using NodeJS and Express.

I have also built another iteration of this project using Prisma, also utilising TypeScript: [divelog-server-prisma](https://github.com/btdrawer/divelog-server-prisma). I decided to build this MongoDB-specific one first as additional practice and evidence of my understanding of GraphQL.

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
