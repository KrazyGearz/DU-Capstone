import request from 'supertest';
import '@babel/polyfill';
import startApolloServer from './server.js';
import cors from 'cors';
import express from 'express';
import {typeDefs, resolvers} from './schema.js';
import { ApolloServer } from '@apollo/server';
const app = express();
app.use(cors());
app.use(express.json());

describe('api', () => 
{
    const testServer = new ApolloServer(
        {
        typeDefs,
        resolvers,
        })
    
  
    describe('get book', () => {
        const getbook = `
        query GetBook($getBookId: ID!) {
            getBook(id: $getBookId) {
              title
              id
              description
              coverImage
              categories {
                name
                id
              }
            }
          }
          `;


      it('should return a book by ID', async () => {
        const response = await testServer.executeOperation(
            {
              query: getbook,
              variables: { getBookId: 2 },
            });
        expect(response.body.singleResult.data).toEqual(
            {
                "getBook": {
                    "title": "Harry Potter and the Prisoner of Azkaban",
                    "id": "2",
                    "description": null,
                    "coverImage": "https://m.media-amazon.com/images/I/51DQeuJ5QDL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg",
                    "categories": [
                      {
                        "name": "Fantasy",
                        "id": "1"
                      },
                      {
                        "name": "Fiction",
                        "id": "2"
                      }
                    ]
                  },
            },
          );
      });
    });
    describe('add book', () => {

      const addbook = `
      mutation AddBook($title: String!, $authorId: ID!, $categoryIds: [ID!]!, $addBookDescription2: String) {
        addBook(title: $title, authorId: $authorId, categoryIds: $categoryIds, description: $addBookDescription2) {
          title
          id
          description
          categories {
            id
          }
          author {
            id
          }
        }
      }
          `;
        it('should add a book and return added info', async () => {
            const response = await testServer.executeOperation(
                {
                  query: addbook,
                  variables: { addBookDescription2: "This is a description",
                  title: "Some great book",
                  authorId: 2,
                  categoryIds: [1,2] },
                });
            expect(response.body.singleResult.data).toEqual(
                {
                  "addBook": {
                    "title": "Some great book",
                    "id": "5",
                    "description": "This is a description",
                    "categories": [
                      {
                        "id": "1"
                      },
                      {
                        "id": "2"
                      }
                    ],
                    "author": {
                      "id": "2"
                    }
                  },
                },
              );
          });
    })
  });