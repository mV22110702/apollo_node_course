import { Resolvers } from './types'
import { DataSourceContext } from './context'
import { AuthorModel } from './models'

export const resolvers: Resolvers = {
    Query: {
        // returns an array of Tracks that will be used to populate
        // the homepage grid of our web client
        tracksForHome: (_, __, { dataSources }) => {
            return dataSources.trackAPI.getTracksForHome()
        },
        track: (_, { id }, { dataSources }) => {
            return dataSources.trackAPI.getTrack(id)
        },
    },
    Track: {
        author: ({ authorId }, _, { dataSources }) => {
            return dataSources.trackAPI.getAuthor(authorId)
        },
        modules: ({ id }, _, { dataSources }) => {
            return dataSources.trackAPI.getTrackModules(id)
        },
    },
    Author: {
        photo: ({ photo }, s, d) => {
            return photo
        },
    },
}
