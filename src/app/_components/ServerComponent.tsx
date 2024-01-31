import { serverFetch } from "@/remote/query-utils";
import { useHelloQuery } from "@/remote/gql-generated";

export async function ServerComponent() {
  const { hello } = await serverFetch(useHelloQuery, {
    variables: { name: "from Static Server Component" },
  });

  return <p>{hello.hi}</p>;
}
