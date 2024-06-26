import { GraphQLScalarType, Kind } from 'graphql'

export const dateScalar = new GraphQLScalarType({
    name: 'Date',
    serialize(value: Date) {
        return value.toISOString()
    },
    parseValue(value: string) {
        return new Date(value)
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value)
        }
        return null
    },
})
