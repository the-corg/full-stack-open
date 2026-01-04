const { ApolloServer } = require('@apollo/server');

const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { expressMiddleware } = require('@as-integrations/express5');
const cors = require('cors');
const express = require('express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const http = require('http');

const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/use/ws');

const { GraphQLError } = require('graphql');
const { PubSub } = require('graphql-subscriptions');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

const pubsub = new PubSub();

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch(error => {
    console.log('error connection to MongoDB:', error.message);
  });

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    allGenres: [String!]!
    me: User
  }

  type Subscription {
    bookAdded: Book!
  }

  type Mutation {
  addBook(
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
  ): Book
  editAuthor(
    name: String!
    setBornTo: Int!
  ): Author
  createUser(
    username: String!
    favoriteGenre: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let author;
      if (args.author) author = await Author.findOne({ name: args.author });

      if (args.author && args.genre)
        return Book.find({ author: { _id: author._id }, genres: args.genre });

      if (args.author) return Book.find({ author: { _id: author._id } });

      if (args.genre) return Book.find({ genres: args.genre });

      return Book.find({});
    },
    allAuthors: async () => Author.find({}),
    allGenres: async () => Book.distinct('genres'),
    me: (root, args, context) => context.currentUser,
  },
  Author: {
    bookCount: async root => {
      const books = await Book.find({ author: root });
      return books.length;
    },
  },
  Book: {
    author: async root => Author.findOne({ _id: root.author }),
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('not authenticated', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        try {
          author = await author.save();
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.author, error },
          });
        }
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres,
      });

      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.title, error },
        });
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: book });
      return book;
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('not authenticated', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const author = await Author.findOne({ name: args.name });
      try {
        author.born = args.setBornTo;
        author.save();
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args, error },
        });
      }
      return author;
    },

    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre });

      return user.save().catch(error => {
        throw new GraphQLError('Creating user failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args, error },
        });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const userForToken = {
        username: user.username,
        favoriteGenre: user.favoriteGenre,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: { bookAdded: { subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED') } },
};

/*
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(async ({ url }) => {
  console.log(`Server ready at ${url}`);
});
*/

const startServer = async port => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({ server: httpServer, path: '/' });
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET);
          const currentUser = await User.findById(decodedToken.id);
          return { currentUser };
        }
      },
    })
  );
  httpServer.listen(
    port,
    /*async*/ () => {
      console.log(`Server is now running on http://localhost:${port}`);
      /* Uncomment to reset the database
    const initialAuthors = [
      {
        _id: '5a422b891b54a676234d52fa',
        name: 'Robert Martin',
        born: 1952,
        __v: 0,
      },
      {
        _id: '5a444b891b54a676234d17fa',
        name: 'Martin Fowler',
        born: 1963,
        __v: 0,
      },
      {
        _id: '5a567b3a1b54a676234d17f9',
        name: 'Fyodor Dostoevsky',
        born: 1821,
        __v: 0,
      },
      {
        _id: '5a422b3a3453a676234d17f9',
        name: 'Joshua Kerievsky', // birthyear not known
        __v: 0,
      },
      {
        _id: '5a422b3a1b54a676234d17f9',
        name: 'Sandi Metz', // birthyear not known
        __v: 0,
      },
    ];

    const initialBooks = [
      {
        _id: '5a422a851b54a676234d17f7',
        title: 'Clean Code',
        published: 2008,
        author: 'Robert Martin',
        genres: ['refactoring'],
        __v: 0,
      },
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Agile software development',
        published: 2002,
        author: 'Robert Martin',
        genres: ['agile', 'patterns', 'design'],
        __v: 0,
      },
      {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Refactoring, edition 2',
        published: 2018,
        author: 'Martin Fowler',
        genres: ['refactoring'],
        __v: 0,
      },
      {
        _id: '5a422ba71b54a676234d17fb',
        title: 'Refactoring to patterns',
        published: 2008,
        author: 'Joshua Kerievsky',
        genres: ['refactoring', 'patterns'],
        __v: 0,
      },
      {
        _id: '5a422ba71b54a676234d41fc',
        title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: 'Sandi Metz',
        genres: ['refactoring', 'design'],
        __v: 0,
      },
      {
        _id: '5a422ba21b54a676234d17fb',
        title: 'Crime and punishment',
        published: 1866,
        author: 'Fyodor Dostoevsky',
        genres: ['classic', 'crime'],
        __v: 0,
      },
      {
        _id: '5a422b891b54a676234d17fa',
        title: 'Demons',
        published: 1872,
        author: 'Fyodor Dostoevsky',
        genres: ['classic', 'revolution'],
        __v: 0,
      },
    ];
    await Book.deleteMany({});
    await Author.deleteMany({});

    initialBooks.forEach(b => (b.author = initialAuthors.find(a => a.name === b.author)));
    await Book.insertMany(initialBooks);
    await Author.insertMany(initialAuthors);*/
    }
  );
};

startServer(4000);
