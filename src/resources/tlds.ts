import { HttpClient } from '../client/http-client';
import { ApiResponse, TLD, TldListQuery } from '../types';

/**
 * TLD Management Resource
 * Handles TLD pricing and rules retrieval
 */
export class TLDs {
  constructor(private readonly client: HttpClient) {}

  /**
   * Get all TLD pricing and rules
   * @returns Paginated list of available TLDs with pricing and rules
   */
  async list(query?: TldListQuery): Promise<ApiResponse<TLD[]>> {
    return this.client.get<TLD[]>('/api/v1/tlds', query);
  }

  /**
   * Get specific TLD pricing and rules
   * @param tld - TLD name (e.g., "kr", "com")
   * @returns TLD details with pricing and rules
   */
  async get(tld: string): Promise<TLD> {
    const response = await this.client.get<TLD>(`/api/v1/tlds/${tld}`);
    return response.data;
  }
}
