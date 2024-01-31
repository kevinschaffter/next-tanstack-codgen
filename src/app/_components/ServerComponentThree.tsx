import { useHelloQuery } from "@/remote/gql-generated";
import { serverFetch } from "@/remote/query-utils";

export async function ServerComponentThree() {
  const { hello } = await serverFetch(useHelloQuery, {
    variables: { name: "world" },
    next: { revalidate: 0 },
  });

  return <p>{hello.hi}</p>;
}
