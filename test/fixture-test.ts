import * as graphql from 'graphql';
import * as fs from 'fs';
import { expect } from 'chai';

import graphQLSchema from '../src';

describe('Fixture', () => {
  const directory = `${__dirname}/fixtures/`;
  fs.readdirSync(directory).forEach(file => {
    if (file.endsWith('.json')) {
      describe(file, () => {
        const graphqlFile = file.replace('.json', '.graphql');
        it(`should convert to ${graphqlFile}`, () =>
          graphQLSchema({
            swaggerSchema: directory + file,
            callBackend() {
              return new Promise(() => {});
            },
          }).then(schema => {
            const graphqlfile = directory + graphqlFile;
            const graphschema = graphql.printSchema(schema);
            const expected = fs.readFileSync(graphqlfile, 'utf8');
            expect(graphschema).to.equal(expected);
          }));
      });
    }
  });

  describe('petstore converted to openapi 3', () => {
    it('should have the same graphql schema as openapi 2', async () => {
      const swaggerSchema = `test/fixtures/petstore-openapi3.yaml`;
      const graphqlFile = `test/fixtures/petstore.graphql`;
      const schema = await graphQLSchema({
        swaggerSchema,
        callBackend() {
          return new Promise(() => {});
        },
      });
      const graphschema = graphql.printSchema(schema);
      const expected = fs.readFileSync(graphqlFile, 'utf8');
      expect(graphschema).to.equal(expected);
    });
  });

  describe('OpenAPI3 - allOf, someOf, oneOf', () => {
    const swaggerSchema = `test/fixtures/handle-allOf.yaml`;
    const graphqlFile = `test/fixtures/handle-allOf.graphql`;
    it(`handles allOf - should convert to ${graphqlFile}`, async () => {
      const schema = await graphQLSchema({
        swaggerSchema,
        callBackend() {
          return new Promise(() => {});
        },
      });
      const graphschema = graphql.printSchema(schema);
      const expected = fs.readFileSync(graphqlFile, 'utf8');
      expect(graphschema).to.equal(expected);
    });
  });

});
