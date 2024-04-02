import { TrackAPI } from './datasources/track-api'
import { PubSub } from 'graphql-subscriptions'

export type DataSourceContext = {
    dataSources: {
        trackAPI: TrackAPI
    }
    pubSub: PubSub
}
