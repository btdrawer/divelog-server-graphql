const { gql } = require("apollo-boost");

export const createGroup = gql`
    mutation($data: CreateGroupInput!) {
        createGroup(data: $data) {
            id
            name
            participants {
                id
            }
            messages {
                id
                text
                sender {
                    id
                }
            }
        }
    }
`;

export const getMyGroups = gql`
    query(
        $where: GroupWhereInput
        $sortBy: GroupSortEnum
        $sortOrder: SortOrderEnum
        $limit: Int
        $cursor: String
    ) {
        myGroups(
            where: $where
            sortBy: $sortBy
            sortOrder: $sortOrder
            limit: $limit
            cursor: $cursor
        ) {
            data {
                id
                name
                participants {
                    id
                }
                messages {
                    id
                    text
                }
            }
            pageInfo {
                hasNextPage
                cursor
            }
        }
    }
`;

export const getGroup = gql`
    query($id: ID!) {
        group(id: $id) {
            id
            name
            participants {
                id
            }
            messages {
                id
                text
            }
        }
    }
`;

export const renameGroup = gql`
    mutation($id: ID!, $name: String!) {
        renameGroup(id: $id, name: $name) {
            id
            name
            participants {
                id
            }
            messages {
                id
                text
            }
        }
    }
`;

export const sendMessage = gql`
    mutation($id: ID!, $text: String!) {
        sendMessage(id: $id, text: $text) {
            id
            name
            participants {
                id
            }
            messages {
                id
                text
                sender {
                    id
                }
            }
        }
    }
`;

export const addGroupParticipant = gql`
    mutation($id: ID!, $userId: ID!) {
        addGroupParticipant(id: $id, userId: $userId) {
            id
            name
            participants {
                id
            }
            messages {
                id
                text
            }
        }
    }
`;

export const leaveGroup = gql`
    mutation($id: ID!) {
        leaveGroup(id: $id) {
            id
            name
            participants {
                id
            }
            messages {
                id
                text
            }
        }
    }
`;
