import express from 'express';
import cors from 'cors';
import { ApolloServer, gql } from 'apollo-server-express';
import {books, categories, authors} from './schema.js';
const app = express();
app.use(cors());

app.use(express.json());

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: Author!
    coverImage: String
    categories: [Category!]!
    description: String
  }

  type Author {
    id: ID!
    firstName: String
    lastName: String
    books: [Book!]!
  }

  type Category {
    id: ID!
    name: String!
    books: [Book!]!
  }

  type Query {
    getBooks: [Book!]!
    getBook(id: ID!): Book
    getAuthors: [Author!]!
    getAuthor(id: ID!): Author
    getCategories: [Category!]!
    getCategory(id: ID!): Category
  }

  type Mutation {
    addBook(
      title: String!
      authorId: ID!
      coverImage: String
      categoryIds: [ID!]!
      description: String
    ): Book
    updateBook(
      id: ID
      title: String
      authorId: ID
      categoryIds: [ID]
    ): Book
    removeBook(id: ID!): ID
    addAuthor(firstName: String!, lastName: String!): Author
    updateAuthor(id: ID!, firstName: String!, lastName: String!): Author
    removeAuthor(id: ID!): ID
    addCategory(name: String!): Category
    updateCategory(id: ID!, name: String!): Category
    removeCategory(id: ID!): ID
  }
`;

const resolvers = {
    Book: {
      author: ({ author: authorId }) =>
        authors.find(author => author.id === authorId),
      categories: ({ categories: categoryIds }) =>
        categories.filter(category => categoryIds.includes(category.id))
    },
    Author: {
      books: ({ id: bookId }) => books.filter(book => book.id === bookId)
    },
    Category: {
      books: ({ id: bookId }) => books.filter(book => book.id === bookId)
    },
    Query: {
      getBooks: () => books,
      getBook: (_parent, { id }) => books.find(book => book.id === id),
      getAuthors: () =>
        authors.sort((a, b) => a.lastName.localeCompare(b.lastName)),
      getAuthor: (_parent, { id }) => authors.find(author => author.id === id),
      getCategories: () => categories,
      getCategory: (_parent, { id }) =>
        categories.find(category => category.id === id)
    },
    Mutation: {
      addBook: (
        _parent,
        { title, authorId, coverImage, categoryIds, description }
      ) => {
        const book = {
          id: String(books.length + 1),
          title,
          author: authorId,
          coverImage: coverImage,
          categories: categoryIds,
          description: description
        };
        books.push(book);
        return book;
      },
      addAuthor: (_parent, { firstName, lastName }) => {
        const author = {
          id: String(authors.length + 1),
          firstName,
          lastName
        };
        authors.push(author);
        return author;
      },
      addCategory: (_parent, { name }) => {
        const category = {
          id: String(categories.length + 1),
          name
        };
        categories.push(category);
        return category;
      },
      updateBook: (_parent, { id, title, authorId, categoryIds }) => {
        const bookIndex = books.findIndex(book => book.id === id);
        try{
          if (bookIndex === -1) throw new Error('This book does not exist.');
        
          const book = {
            id,
            title,
            author: authorId,
            categories: categoryIds
          };
        }catch(Error){
          return Error.message;
        }
        books[bookIndex] = book;
  
        return book;
      },
      updateAuthor: (_parent, { id, firstName, lastName }) => {
        const authorIndex = authors.findIndex(author => author.id === id);
        if (authorIndex === -1) throw new Error('This author does not exist.');
        const author = {
          id,
          firstName,
          lastName
        };
        authors[authorIndex] = author;
        return author;
      },
      updateCategory: (_parent, { id, name }) => {
        const categoryIndex = categories.findIndex(
          category => category.id === id
        );
        if (categoryIndex === -1)
          throw new Error('This category does not exist.');
        const category = {
          id,
          name
        };
        categories[categoryIndex] = category;
        return category;
      },
      removeBook: (_parent, { id }) => {
        const bookIndex = books.findIndex(book => book.id === id);
        if (bookIndex === -1) throw new Error('This book does not exist.');
        const [book] = books.splice(bookIndex, 1);
        return book.id;
      },
      removeAuthor: (_parent, { id }) => {
        const authorIndex = authors.findIndex(author => author.id === id);
        if (authorIndex === -1) throw new Error('This author does not exist.');
        const [author] = authors.splice(authorIndex, 1);
        return author.id;
      },
      removeCategory: (_parent, { id }) => {
        const categoryIndex = categories.findIndex(
          category => category.id === id
        );
        if (categoryIndex === -1)
          throw new Error('This category does not exist.');
        const [category] = categories.splice(categoryIndex, 1);
        return category.id;
      }
    }
  };


export {app}; 