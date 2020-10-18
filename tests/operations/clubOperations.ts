const { gql } = require("apollo-boost");

export const createClub = gql`
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

export const getClubs = gql`
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

export const getClub = gql`
    query($id: ID!) {
        club(id: $id) {
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

export const updateClub = gql`
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

export const addClubManager = gql`
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

export const removeClubManager = gql`
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

export const joinClub = gql`
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

export const leaveClub = gql`
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

export const removeClubMember = gql`
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

export const deleteClub = gql`
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
