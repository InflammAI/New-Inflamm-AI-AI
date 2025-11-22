export declare const query: (text: string, params?: any[]) => Promise<QueryResult<any>>;
/**
 * Properly extend PoolClient so TS knows query and
elease exist and have proper types.
 */
export interface ExtendedClient extends PoolClient {
    lastQuery?: [string, any[]?];
    query: (text: string, params?: any[]) => Promise<QueryResult<any>>;
    release: () => void;
}
export declare const getClient: () => Promise<ExtendedClient>;
declare const _default: {
    query: (text: string, params?: any[]) => Promise<QueryResult<any>>;
    getClient: () => Promise<ExtendedClient>;
    pool: any;
};
export default _default;
//# sourceMappingURL=database.d.ts.map