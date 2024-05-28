export function queryBuilder(method: string, params: Record<string, string>) {
  return JSON.stringify({
    jsonrpc: "2.0",
    method: method,
    params: [params],
    id: 1,
  });
}
