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

exports.getUsers = gql`
    query(
        $where: UserWhereInput
        $sortBy: UserSortEnum
        $sortOrder: SortOrderEnum
        $limit: Int
        $skip: Int
    ) {
        users(
            where: $where
            sortBy: $sortBy
            sortOrder: $sortOrder
            limit: $limit
            skip: $skip
        ) {
            id
            name
            username
            email
        }
    }
`;

exports.getMe = gql`
    query {
        me {
            id
            name
            username
            email
        }
    }
`;

exports.updateUser = gql`
    mutation($data: UpdateUserInput!) {
        updateUser(data: $data) {
            id
            name
            username
            email
        }
    }
`;

exports.deleteUser = gql`
    mutation {
        deleteUser {
            id
        }
    }
`;
