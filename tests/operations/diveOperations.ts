const { gql } = require("apollo-boost");

export const createDive = gql`
    mutation($data: CreateDiveInput!) {
        createDive(data: $data) {
            id
            timeIn
            timeOut
            bottomTime
            safetyStopTime
            diveTime
            maxDepth
            location
            description
            club {
                id
            }
            user {
                id
            }
            buddies {
                id
            }
            gear {
                id
            }
            public
        }
    }
`;

export const getDives = gql`
    query(
        $userId: ID!
        $where: DiveWhereInput
        $sortBy: DiveSortEnum
        $sortOrder: SortOrderEnum
        $limit: Int
        $cursor: String
    ) {
        dives(
            userId: $userId
            where: $where
            sortBy: $sortBy
            sortOrder: $sortOrder
            limit: $limit
            cursor: $cursor
        ) {
            data {
                id
                timeIn
                timeOut
                bottomTime
                safetyStopTime
                diveTime
                maxDepth
                location
                description
                club {
                    id
                }
                user {
                    id
                }
                buddies {
                    id
                }
                gear {
                    id
                }
                public
            }
            pageInfo {
                hasNextPage
                cursor
            }
        }
    }
`;

export const getMyDives = gql`
    query(
        $where: MyDiveWhereInput
        $sortBy: DiveSortEnum
        $sortOrder: SortOrderEnum
        $limit: Int
        $cursor: String
    ) {
        myDives(
            where: $where
            sortBy: $sortBy
            sortOrder: $sortOrder
            limit: $limit
            cursor: $cursor
        ) {
            data {
                id
                timeIn
                timeOut
                bottomTime
                safetyStopTime
                diveTime
                maxDepth
                location
                description
                club {
                    id
                }
                user {
                    id
                }
                buddies {
                    id
                }
                gear {
                    id
                }
                public
            }
            pageInfo {
                hasNextPage
                cursor
            }
        }
    }
`;

export const getDive = gql`
    query($id: ID!) {
        dive(id: $id) {
            id
            timeIn
            timeOut
            bottomTime
            safetyStopTime
            diveTime
            maxDepth
            location
            description
            club {
                id
            }
            user {
                id
            }
            buddies {
                id
            }
            gear {
                id
            }
            public
        }
    }
`;

export const updateDive = gql`
    mutation($id: ID!, $data: UpdateDiveInput!) {
        updateDive(id: $id, data: $data) {
            id
            timeIn
            timeOut
            bottomTime
            safetyStopTime
            diveTime
            maxDepth
            location
            description
            club {
                id
            }
            user {
                id
            }
            buddies {
                id
            }
            gear {
                id
            }
            public
        }
    }
`;

export const addGearToDive = gql`
    mutation($id: ID!, $gearId: ID!) {
        addGearToDive(id: $id, gearId: $gearId) {
            id
            timeIn
            timeOut
            bottomTime
            safetyStopTime
            diveTime
            maxDepth
            location
            description
            club {
                id
            }
            user {
                id
            }
            buddies {
                id
            }
            gear {
                id
            }
            public
        }
    }
`;

export const removeGearFromDive = gql`
    mutation($id: ID!, $gearId: ID!) {
        removeGearFromDive(id: $id, gearId: $gearId) {
            id
            timeIn
            timeOut
            bottomTime
            safetyStopTime
            diveTime
            maxDepth
            location
            description
            club {
                id
            }
            user {
                id
            }
            buddies {
                id
            }
            gear {
                id
            }
            public
        }
    }
`;

export const addBuddyToDive = gql`
    mutation($id: ID!, $buddyId: ID!) {
        addBuddyToDive(id: $id, buddyId: $buddyId) {
            id
            timeIn
            timeOut
            bottomTime
            safetyStopTime
            diveTime
            maxDepth
            location
            description
            club {
                id
            }
            user {
                id
            }
            buddies {
                id
            }
            gear {
                id
            }
            public
        }
    }
`;

export const removeBuddyFromDive = gql`
    mutation($id: ID!, $buddyId: ID!) {
        removeBuddyFromDive(id: $id, buddyId: $buddyId) {
            id
            timeIn
            timeOut
            bottomTime
            safetyStopTime
            diveTime
            maxDepth
            location
            description
            club {
                id
            }
            user {
                id
            }
            buddies {
                id
            }
            gear {
                id
            }
            public
        }
    }
`;

export const deleteDive = gql`
    mutation($id: ID!) {
        deleteDive(id: $id) {
            id
        }
    }
`;
