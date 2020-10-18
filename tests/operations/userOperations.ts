const { gql } = require("apollo-server");

export const createUser = gql`
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

export const login = gql`
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

export const getUsers = gql`
    query(
        $where: UserWhereInput
        $sortBy: UserSortEnum
        $sortOrder: SortOrderEnum
        $limit: Int
        $cursor: String
    ) {
        users(
            where: $where
            sortBy: $sortBy
            sortOrder: $sortOrder
            limit: $limit
            cursor: $cursor
        ) {
            data {
                id
                name
                username
                email
            }
            pageInfo {
                hasNextPage
                cursor
            }
        }
    }
`;

export const getMe = gql`
    query {
        me {
            id
            name
            username
            email
        }
    }
`;

export const getUser = gql`
    query($id: ID!) {
        user(id: $id) {
            id
            name
            username
            email
        }
    }
`;

export const updateUser = gql`
    mutation($data: UpdateUserInput!) {
        updateUser(data: $data) {
            id
            name
            username
            email
        }
    }
`;

export const deleteUser = gql`
    mutation {
        deleteUser {
            id
        }
    }
`;
