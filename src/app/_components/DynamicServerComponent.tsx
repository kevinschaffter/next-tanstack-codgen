import { useHelloQuery } from "@/remote/gql-generated";
import { serverFetch } from "@/remote/query-utils";

export async function DynamicServerComponent() {
  const { hello } = await serverFetch(useHelloQuery, {
    variables: { name: "from Dynamic Server Component" },
    next: { revalidate: 0 },
  });

  return <p>{hello.hi}</p>;
}
