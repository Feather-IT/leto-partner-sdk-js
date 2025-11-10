import { HttpClient } from '../client/http-client';
import { TLD } from '../types';

/**
 * TLD Management Resource
 * Handles TLD pricing and rules retrieval
 */
export class TLDs {
  constructor(private readonly client: HttpClient) {}

  /**
   * Get all TLD pricing and rules
   * @returns Array of all available TLDs with pricing and rules
   */
  async list(): Promise<TLD[]> {
    const response = await this.client.get<TLD[]>('/api/v1/tlds');
    return response.data;
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
