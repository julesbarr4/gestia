import {
  MOCK_PROFILE,
  MOCK_CLIENTS,
  MOCK_DEVIS,
  MOCK_FACTURES,
  MOCK_LOGS,
} from "./mock-data";

function makeQuery(data: unknown) {
  const result = { data, error: null, count: Array.isArray(data) ? (data as unknown[]).length : null };
  const chain: Record<string, unknown> = {};

  const wrap = (d: unknown) => makeQuery(d);

  chain.select = (..._args: unknown[]) => wrap(data);
  chain.eq = (_col: string, _val: unknown) => {
    if (!Array.isArray(data)) return wrap(data);
    return wrap(data);
  };
  chain.in = (_col: string, _vals: unknown[]) => wrap(data);
  chain.gte = (_col: string, _val: unknown) => wrap(data);
  chain.lte = (_col: string, _val: unknown) => wrap(data);
  chain.order = (_col: string, _opts?: unknown) => wrap(data);
  chain.limit = (_n: number) => wrap(data);
  chain.single = () => {
    const single = Array.isArray(data) ? (data as unknown[])[0] ?? null : data;
    return { data: single, error: null };
  };
  chain.insert = (_row: unknown) => wrap(null);
  chain.update = (_row: unknown) => wrap(null);
  chain.head = true;
  chain.count = Array.isArray(data) ? (data as unknown[]).length : 0;
  chain.then = (resolve: (v: unknown) => void) => resolve(result);

  return chain;
}

export function getMockSupabaseClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => {
      let tableData: unknown = null;

      if (table === "profiles") tableData = [MOCK_PROFILE];
      else if (table === "clients") tableData = MOCK_CLIENTS;
      else if (table === "devis") tableData = MOCK_DEVIS;
      else if (table === "factures") tableData = MOCK_FACTURES;
      else if (table === "agents_logs") tableData = MOCK_LOGS;
      else tableData = [];

      return makeQuery(tableData);
    },
  };
}
