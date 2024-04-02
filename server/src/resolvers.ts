import { Resolvers } from './types'
import { DataSourceContext } from './context'
import { AuthorModel } from './models'
import { dateScalar } from './scalars/Date'
import { withFilter } from 'graphql-subscriptions'

// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
export const resolvers: Resolvers = {
    Date: dateScalar,
    Entity: {
        __resolveType: (parent, context, info) => {
            if ('modulesCount' in parent) {
                return 'Track'
            }
            return 'Module'
        },
    },
    SearchResult: {
        __resolveType: (parent, context, info) => {
            if ('modulesCount' in parent) {
                return 'Track'
            }
            return 'Module'
        },
    },
    Mutation: {
        incrementTrackViews: async (
            _,
            { trackId },
            { dataSources, pubSub }
        ) => {
            const track =
                await dataSources.trackAPI.incrementTrackViews(trackId)
            await pubSub.publish('numberOfViews', track.numberOfViews)
            console.log('incremented track views')
            return track
        },
    },
    Subscription: {
        numberOfViews: {
            //@ts-ignore
            subscribe: withFilter(
                //@ts-ignore
                (parent, args, context, info) => {
                    console.log('subscribing')
                    return context.pubSub.asyncIterator([
                        'numberOfViews',
                    ]) as AsyncIterator<any>
                },
                (payload, variables) => true
            ),
        },
    },
    Query: {
        getEntity: (_, { createdAt }, { dataSources }) => {
            return dataSources.trackAPI.getTracksForHome()
        },
        search: (_, __, { dataSources }) => {
            return dataSources.trackAPI.getTracksForHome()
        },
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
        createdAt: () => new Date(),
    },
    Author: {
        photo: ({ photo }, s, d) => {
            return photo
        },
    },
}
