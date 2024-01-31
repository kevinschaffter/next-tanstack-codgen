import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { NextRequest } from "next/server";
import { HelloQueryVariables, HelloResponse } from "@/remote/gql-generated";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const resolvers = {
  Query: {
    hello: async (_, { name }: HelloQueryVariables): Promise<HelloResponse> => {
      await sleep(2000);
      return { hi: "Hello", bye: "Bye" };
    },
  },
};

const typeDefs = gql`
  type HelloResponse {
    hi: String!
    bye: String!
  }

  type Query {
    hello(name: String): HelloResponse!
  }
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server);

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
