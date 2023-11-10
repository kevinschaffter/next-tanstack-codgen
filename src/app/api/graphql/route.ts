import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { NextRequest } from "next/server";
import { HelloQueryVariables } from "@/remote/gql-generated";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const resolvers = {
  Query: {
    hello: async (_, { name }: HelloQueryVariables) => {
      await sleep(2000);
      return `Hello ${name}`;
    },
  },
};

const typeDefs = gql`
  type Query {
    hello(name: String): String!
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
