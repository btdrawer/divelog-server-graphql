const { gql } = require("apollo-boost");

exports.createDive = gql`
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

exports.getDives = gql`
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

exports.getMyDives = gql`
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

exports.getDive = gql`
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

exports.updateDive = gql`
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

exports.addGearToDive = gql`
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

exports.removeGearFromDive = gql`
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

exports.addBuddyToDive = gql`
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

exports.removeBuddyFromDive = gql`
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

exports.deleteDive = gql`
    mutation($id: ID!) {
        deleteDive(id: $id) {
            id
        }
    }
`;
