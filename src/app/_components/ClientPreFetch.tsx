"use client";

import { useHelloQuery } from "@/remote/gql-generated";

export function ClientPreFetch() {
  const { data } = useHelloQuery({
    name: "from Server Hydrated Client Component",
  });

  if (!data?.hello) return;
  return <p>{data.hello}</p>;
}
