const { gql } = require("apollo-boost");

exports.createGear = gql`
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

exports.getGear = gql`
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

exports.updateGear = gql`
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

exports.deleteGear = gql`
    mutation($id: ID!) {
        deleteGear(id: $id) {
            id
        }
    }
`;
