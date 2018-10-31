import express from 'express'
import graphqlHTTP from 'express-graphql'
import { makeExecutableSchema } from 'graphql-tools'
import cors from 'cors'

const app = express()

app.use(cors())

const homePath = '/graphql'
const URL = 'http://localhost'
const PORT = 3001

const typeDefs = [`
  type Query {
    post(_id: String): Post
    posts: [Post]
    comment(_id: String): Comment
  }

  type Post {
    _id: String
    title: String
    content: String
    comments: [Comment]
  }

  type Comment {
    _id: String
    postId: String
    content: String
    post: Post
  }

  schema {
    query: Query
  }
`];

const resolvers = {
  Query: {
    post: async (root, {_id}) => {
      return {}
    },
    posts: async () => {
      return []
    },
    comment: async (root, {_id}) => {
      return {}
    },
  },
  Post: {
    comments: async ({_id}) => {
      return []
    }
  },
  Comment: {
    post: async ({postId}) => {
      return {}
    }
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.listen(PORT, () => {
  console.log(`Visit ${URL}:${PORT}${homePath}`)
})
