export type QueryStatus = 'idle' | 'pending' | 'error' | 'success'
export interface QueryState<TData, TError> {
  status: QueryStatus
  error?: TError
  data?: TData
}

export type QueryKey = unknown[]
export type QueryFunction<TData> = () => Promise<TData>

export interface QueryOptions<TData> {
  queryKey: QueryKey
  queryFn: QueryFunction<TData>
}
