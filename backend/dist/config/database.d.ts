import { Pool, PoolClient, QueryResult } from 'pg';
export declare const query: (text: string, params?: any[]) => Promise<QueryResult>;
interface ExtendedClient extends PoolClient {
    lastQuery?: unknown[];
}
export declare const getClient: () => Promise<ExtendedClient>;
declare const _default: {
    query: (text: string, params?: any[]) => Promise<QueryResult>;
    getClient: () => Promise<ExtendedClient>;
    pool: Pool;
};
export default _default;
//# sourceMappingURL=database.d.ts.map