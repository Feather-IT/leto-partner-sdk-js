import { HttpClient } from '../client/http-client';
import { AccountStatusResponse } from '../types';

/**
 * Account Management Resource
 * Handles account status queries
 */
export class Account {
  constructor(private readonly client: HttpClient) {}

  /**
   * Get tenant account status and balance
   * @returns Account status including balance and expiry
   */
  async getStatus(): Promise<AccountStatusResponse> {
    const response = await this.client.get<AccountStatusResponse>(
      '/api/v1/account/status'
    );
    return response.data;
  }
}
