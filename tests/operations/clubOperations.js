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
        $skip: Int
    ) {
        clubs(
            where: $where
            sortBy: $sortBy
            sortOrder: $sortOrder
            limit: $limit
            skip: $skip
        ) {
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
    mutation($clubId: ID!, $userId: ID!) {
        addClubManager(clubId: $clubId, userId: $userId) {
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
    mutation($clubId: ID!, $managerId: ID!) {
        removeClubManager(clubId: $clubId, managerId: $managerId) {
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
    mutation($clubId: ID!, $memberId: ID!) {
        removeClubMember(clubId: $clubId, memberId: $memberId) {
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
