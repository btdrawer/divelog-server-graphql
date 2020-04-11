const { gql } = require("apollo-boost");

exports.createGroup = gql`
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

exports.getMyGroups = gql`
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

exports.getGroup = gql`
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

exports.renameGroup = gql`
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

exports.sendMessage = gql`
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

exports.addGroupParticipant = gql`
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

exports.leaveGroup = gql`
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