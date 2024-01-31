"use client";

import { useHelloQuery } from "@/remote/gql-generated";

export function ClientComponent() {
  const { data, isLoading } = useHelloQuery({ name: "from Client Component" });
  return <p>{isLoading ? "loading..." : data?.hello.bye}</p>;
}
