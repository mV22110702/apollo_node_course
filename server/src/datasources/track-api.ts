import { RESTDataSource } from '@apollo/datasource-rest'
import { AuthorModel, ModuleModel, TrackModel } from '../models'

export class TrackAPI extends RESTDataSource {
    constructor(options) {
        super(options)
    }
    baseURL = 'https://odyssey-lift-off-rest-api.herokuapp.com/'

    getTracksForHome() {
        return this.get<TrackModel[]>('tracks', { cacheOptions: { ttl: 60 } })
    }

    getNumberOfViews(trackId: string) {
        return this.get<number>(`track/${trackId}/numberOfViews`)
    }

    incrementTrackViews(trackId: string) {
        return this.patch<TrackModel>(`track/${trackId}/numberOfViews`)
    }

    getTrack(trackId: string) {
        return this.get<TrackModel>(`track/${trackId}`)
    }

    getTrackModules(trackId: string) {
        return this.get<ModuleModel[]>(`track/${trackId}/modules`)
    }

    getAuthor(authorId: string) {
        return this.get<AuthorModel>(`author/${encodeURIComponent(authorId)}`)
    }
}
