import {
  QueryClient,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { cache } from "react";

type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};

interface QueryWithKey<TData = any, TVariables = any> {
  (
    variables?: TVariables,
    options?: Omit<UseQueryOptions<TData, unknown, TData>, "queryKey"> & {
      queryKey?: UseQueryOptions<TData, unknown, TData>["queryKey"];
    }
  ): UseQueryResult<TData, unknown>;
  getKey: (variables?: any) => QueryKey;
  fetcher: (variables?: any, options?: any) => () => Promise<TData>;
}

type QueryParams<TQuery extends QueryWithKey> = Parameters<TQuery>[0];

const hasVariablesTypeGuard = <TQuery extends QueryWithKey>(
  variables?: ServerFetchOptions<TQuery>
): variables is {
  variables: QueryParams<TQuery>[0];
  next?: NextFetchRequestConfig;
} => !!Object.keys(variables || {}).length;

export type ServerFetchOptions<TQuery extends QueryWithKey> =
  Parameters<TQuery>[0] extends
    | Exact<{
        [key: string]: never;
      }>
    | undefined
    ? { next?: NextFetchRequestConfig; cache?: RequestCache }
    : {
        variables?: Parameters<TQuery>[0];
        next?: NextFetchRequestConfig;
        cache?: RequestCache;
      };

type FetcherReturnValue<TQuery extends QueryWithKey> = Awaited<
  ReturnType<ReturnType<TQuery["fetcher"]>>
>;

const cachedServerPreFetch = cache(
  async <TQuery extends QueryWithKey>(
    useQuery: TQuery,
    stringifiedQueryOptions?: string
  ) => {
    const queryOptions = stringifiedQueryOptions
      ? JSON.parse(stringifiedQueryOptions)
      : undefined;
    const hasVariables = hasVariablesTypeGuard<TQuery>(queryOptions);
    let variables: QueryParams<TQuery> | undefined;
    if (hasVariables) {
      variables = queryOptions.variables;
    }
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
      queryKey: useQuery.getKey(variables),
      queryFn: useQuery.fetcher(variables, {
        next: queryOptions?.next,
        cache: queryOptions?.cache,
      }),
    });
    return queryClient;
  }
);

export const serverPreFetch = async <TQuery extends QueryWithKey>(
  useQuery: TQuery,
  queryOptions?: ServerFetchOptions<TQuery>
) => {
  let stringifiedQueryOptions: string | undefined;
  if (queryOptions) stringifiedQueryOptions = JSON.stringify(queryOptions);
  return cachedServerPreFetch(useQuery, stringifiedQueryOptions);
};

const cachedServerFetch = cache(
  async <TQuery extends QueryWithKey>(
    useQuery: TQuery,
    stringifiedQueryOptions?: string
  ) => {
    const queryOptions = stringifiedQueryOptions
      ? JSON.parse(stringifiedQueryOptions)
      : undefined;
    const hasVariables = hasVariablesTypeGuard<TQuery>(queryOptions);
    let variables: QueryParams<TQuery> | undefined;
    if (hasVariables) {
      variables = queryOptions.variables;
    }
    const queryClient = new QueryClient();
    const data = await queryClient.fetchQuery<
      FetcherReturnValue<TQuery>,
      QueryParams<TQuery>
    >({
      queryKey: useQuery.getKey(variables),
      queryFn: useQuery.fetcher(variables, {
        next: queryOptions?.next,
        cache: queryOptions?.cache,
      }),
    });
    return data;
  }
);

export const serverFetch = async <TQuery extends QueryWithKey>(
  useQuery: TQuery,
  queryOptions?: ServerFetchOptions<TQuery>
) => {
  let stringifiedQueryOptions: string | undefined;
  if (queryOptions) stringifiedQueryOptions = JSON.stringify(queryOptions);
  return cachedServerFetch(useQuery, stringifiedQueryOptions);
};
