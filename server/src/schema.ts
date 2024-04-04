import gql from 'graphql-tag'

export const typeDefs = gql`
    # Schema definitions go here

    scalar Date

    directive @upper on FIELD_DEFINITION

    enum AllowedColor {
        RED
        GREEN
        BLUE
    }
    
    enum CatColor {
        Ginger
        Black
        White
        Ashen
    }

    interface Entity {
        id: ID!
        title: String! @upper
    }

    union SearchResult = Track | Module

    type Module implements Entity {
        id: ID!
        "The Module's title"
        title: String!
        "The Module's length in minutes"
        length: Int
    }

    "A track is a group of Modules that teaches about a specific topic"
    type Track implements Entity {
        id: ID!
        createdAt: Date
        title: String! @upper
        author: Author!
        thumbnail: String
        length: Int
        modulesCount: Int
        description: String
        numberOfViews: Int
        modules: [Module!]!
    }
    "Author of a complete Track or a Module"
    type Author {
        id: ID!
        name: String!
        photo: String
    }

    type Query {
        getEntity(createdAt: Date): [Entity!]!
        "Get track or module by ID"
        search: [SearchResult!]!
        "Get tracks array for homepage grid"
        tracksForHome: [Track!]!
        track(id: ID!): Track
    }
    
    type IncrementTrackViewsResponse {
        "Similar to HTTP status code, represents the status of the mutation"
        code: Int!
        "Indicates whether the mutation was successful"
        success: Boolean!
        "Human-readable message for the UI"
        message: String!
        "Newly updated track after a successful mutation"
        track: Track
    }

    type Mutation {
        incrementTrackViews(trackId: ID!): IncrementTrackViewsResponse!
    }

    type Subscription {
        numberOfViews(trackId: ID!): Int!
    }
`
