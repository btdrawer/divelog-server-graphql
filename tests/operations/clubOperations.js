const { gql } = require("apollo-boost");

exports.createClub = gql`
    mutation($data: CreateClubInput!) {
        createClub(data: $data) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;

exports.getClubs = gql`
    query(
        $where: ClubWhereInput
        $sortBy: ClubSortEnum
        $sortOrder: SortOrderEnum
        $limit: Int
        $cursor: String
    ) {
        clubs(
            where: $where
            sortBy: $sortBy
            sortOrder: $sortOrder
            limit: $limit
            cursor: $cursor
        ) {
            data {
                id
                name
                location
                website
                managers {
                    id
                }
                members {
                    id
                }
            }
            pageInfo {
                hasNextPage
                cursor
            }
        }
    }
`;

exports.updateClub = gql`
    mutation($id: ID!, $data: UpdateClubInput!) {
        updateClub(id: $id, data: $data) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;

exports.addClubManager = gql`
    mutation($id: ID!, $userId: ID!) {
        addClubManager(id: $id, userId: $userId) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;

exports.removeClubManager = gql`
    mutation($id: ID!, $userId: ID!) {
        removeClubManager(id: $id, userId: $userId) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;

exports.joinClub = gql`
    mutation($id: ID!) {
        joinClub(id: $id) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;

exports.leaveClub = gql`
    mutation($id: ID!) {
        leaveClub(id: $id) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;

exports.removeClubMember = gql`
    mutation($id: ID!, $userId: ID!) {
        removeClubMember(id: $id, userId: $userId) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;

exports.deleteClub = gql`
    mutation($id: ID!) {
        deleteClub(id: $id) {
            id
            name
            location
            website
            managers {
                id
            }
            members {
                id
            }
        }
    }
`;
