import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './schema'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { addMocksToSchema } from '@graphql-tools/mock'
import { resolvers } from './resolvers'
import { TrackAPI } from './datasources/track-api'
import { upperDirectiveTransformer } from './directives/upper'
import { ApolloServerErrorCode } from '@apollo/server/errors'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { createServer } from 'http'
import express from 'express'
import { expressMiddleware } from '@apollo/server/express4'
import bodyParser from 'body-parser'
import cors from 'cors'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { PubSub } from 'graphql-subscriptions'

async function startApolloServer() {
    let schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    })
    schema = upperDirectiveTransformer(schema, 'upper')

    const app = express()

    const httpServer = createServer(app)

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    })

    const pubSub = new PubSub()

    const serverCleanup = useServer(
        {
            schema,
            context: async () => {
                return {
                    dataSources: {
                        trackAPI: new TrackAPI({ cache: server.cache }),
                    },
                    pubSub,
                }
            },
        },
        wsServer
    )

    const server = new ApolloServer({
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({ httpServer }),

            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose()
                        },
                    }
                },
            },
            {
                requestDidStart: async ({ request, response }) => {
                    return {
                        async willSendResponse({ response }) {
                            response.http.headers.set('custom-header', 'hello')
                            if (
                                response.body.kind === 'single' &&
                                response.body.singleResult.errors?.[0]
                                    ?.extensions?.code === 'TEAPOT'
                            ) {
                                response.http.status = 418
                            }
                        },
                    }
                },
            },
        ],
        includeStacktraceInErrorResponses: false,
        formatError: (formattedError, error) => {
            return {
                ...formattedError,
                message: 'Cannot parse the query :(',
            }
        },
        schema,
    })
    await server.start()
    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async () => {
                return {
                    dataSources: {
                        trackAPI: new TrackAPI({ cache: server.cache }),
                    },
                    pubSub: new PubSub(),
                }
            },
        })
    )

    const PORT = 4000
    // Now that our HTTP server is fully set up, we can listen to it.
    httpServer.listen(PORT, () => {
        console.log(`Server is now running on http://localhost:${PORT}/graphql`)
    })
}

startApolloServer()
