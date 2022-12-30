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
      
      it('should with the correct pet if it exists', async () => {
        const response = await request(app).get('/api/v1/pets/1');
        expect(response.body).toEqual(pets[0]);
      });

      it('should return status 404 if the pet does not exists', async () => {
        const response = await request(app).get('/api/v1/pets/7');
        expect(response.status).toBe(404);
      });//
      
      it('should with respond Pet not found', async () => {
        const response = await request(app).get('/api/v1/pets/7');
        expect(response.body).toEqual('Pet not found');
      });
    })
  });