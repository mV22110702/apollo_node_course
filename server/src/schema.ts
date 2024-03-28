import gql from 'graphql-tag'

export const typeDefs = gql`
    # Schema definitions go here

    type Module {
        id: ID!
        "The Module's title"
        title: String!
        "The Module's length in minutes"
        length: Int
    }

    "A track is a group of Modules that teaches about a specific topic"
    type Track {
        id: ID!
        title: String!
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
        "Get tracks array for homepage grid"
        tracksForHome: [Track!]!
        track(id: ID!): Track
    }
`
