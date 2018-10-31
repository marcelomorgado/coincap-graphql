import "@babel/register";
import "@babel/polyfill";
import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'


const app = express()

app.use(cors())

const homePath = '/graphiql'
const URL = 'http://localhost'
const PORT = 3001

export const start = async () => {
  try {

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


    app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))


    app.use(homePath, graphiqlExpress({
      endpointURL: '/graphql'
    }))

    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}${homePath}`)
    })

  } catch (e) {
    console.log(e)
  }

}

start();
