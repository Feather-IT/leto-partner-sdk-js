import { HttpClient } from '../client/http-client';
import { ApiResponse, Transaction, TransactionListQuery } from '../types';

/**
 * Transactions Resource
 * Handles transaction queries
 */
export class Transactions {
  constructor(private readonly client: HttpClient) {}

  /**
   * Query transactions with filtering and pagination
   * @param query - Query parameters for filtering transactions
   * @returns Paginated list of transactions
   */
  async list(query?: TransactionListQuery): Promise<ApiResponse<Transaction[]>> {
    return await this.client.get<Transaction[]>('/api/v1/transactions', query);
  }
}
