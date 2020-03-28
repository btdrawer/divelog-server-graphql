const { gql } = require("apollo-boost");

exports.createUser = gql`
    mutation($data: CreateUserInput!) {
        createUser(data: $data) {
            user {
                id
                name
                username
                email
            }
            token
        }
    }
`;
