const { gql } = require("apollo-boost");

export const createGear = gql`
    mutation($data: GearInput!) {
        createGear(data: $data) {
            id
            name
            brand
            model
            type
        }
    }
`;

export const getGear = gql`
    query(
        $where: GearWhereInput
        $sortBy: GearSortEnum
        $sortOrder: SortOrderEnum
        $limit: Int
        $cursor: String
    ) {
        gear(
            where: $where
            sortBy: $sortBy
            sortOrder: $sortOrder
            limit: $limit
            cursor: $cursor
        ) {
            data {
                id
                name
                brand
                model
                type
            }
            pageInfo {
                hasNextPage
                cursor
            }
        }
    }
`;

export const getGearById = gql`
    query($id: ID!) {
        gearById(id: $id) {
            id
            name
            brand
            model
            type
        }
    }
`;

export const updateGear = gql`
    mutation($id: ID!, $data: GearInput!) {
        updateGear(id: $id, data: $data) {
            id
            name
            brand
            model
            type
        }
    }
`;

export const deleteGear = gql`
    mutation($id: ID!) {
        deleteGear(id: $id) {
            id
        }
    }
`;
