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
        $skip: Int
    ) {
        dives(
            userId: $userId
            where: $where
            sortBy: $sortBy
            sortOrder: $sortOrder
            limit: $limit
            skip: $skip
        ) {
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

exports.getMyDives = gql`
    query(
        $where: MyDiveWhereInput
        $sortBy: DiveSortEnum
        $sortOrder: SortOrderEnum
        $limit: Int
        $skip: Int
    ) {
        myDives(
            where: $where
            sortBy: $sortBy
            sortOrder: $sortOrder
            limit: $limit
            skip: $skip
        ) {
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
    mutation($diveId: ID!, $gearId: ID!) {
        addGearToDive(diveId: $diveId, gearId: $gearId) {
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
    mutation($diveId: ID!, $gearId: ID!) {
        removeGearFromDive(diveId: $diveId, gearId: $gearId) {
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
    mutation($diveId: ID!, $buddyId: ID!) {
        addBuddyToDive(diveId: $diveId, buddyId: $buddyId) {
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
    mutation($diveId: ID!, $buddyId: ID!) {
        removeBuddyFromDive(diveId: $diveId, buddyId: $buddyId) {
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
