const { gql } = require("apollo-server");

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

exports.login = gql`
    mutation($username: String!, $password: String!) {
        login(username: $username, password: $password) {
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
