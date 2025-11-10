import { HttpClient } from '../client/http-client';
import {
  Transfer,
  TransferAuthCodeVerifyRequest,
  TransferAuthCodeVerifyResult,
  TransferInitiateRequest,
} from '../types';

/**
 * Transfer Management Resource
 * Handles domain transfer operations
 */
export class Transfers {
  constructor(private readonly client: HttpClient) {}

  /**
   * Verify authorization code for domain transfer
   * @param request - Domain and auth code to verify
   * @returns Verification result with domain details
   */
  async verifyAuthCode(
    request: TransferAuthCodeVerifyRequest
  ): Promise<TransferAuthCodeVerifyResult> {
    const response = await this.client.post<TransferAuthCodeVerifyResult>(
      '/api/v1/domains/transfer/auth-code/verify',
      request
    );
    return response.data;
  }

  /**
   * Initiate a domain transfer
   * @param request - Transfer details including domain, auth code, and optional settings
   * @returns Transfer object with status
   */
  async initiate(request: TransferInitiateRequest): Promise<Transfer> {
    const response = await this.client.post<Transfer>(
      '/api/v1/domains/transfer',
      request
    );
    return response.data;
  }

  /**
   * Get transfer status
   * @param transferId - Transfer ID
   * @returns Transfer details and current status
   */
  async get(transferId: string): Promise<Transfer> {
    const response = await this.client.get<Transfer>(
      `/api/v1/domains/transfer/${transferId}`
    );
    return response.data;
  }
}
