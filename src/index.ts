/**
 * LETO Partner SDK
 * Official JavaScript/TypeScript SDK for LETO Domain Reseller API
 *
 * @packageDocumentation
 */

import { HttpClient } from './client/http-client';
import { Domains } from './resources/domains';
import { Contacts } from './resources/contacts';
import { Transfers } from './resources/transfers';
import { TLDs } from './resources/tlds';
import { Transactions } from './resources/transactions';
import { Account } from './resources/account';
import { LetoConfig } from './types';

/**
 * Main LETO SDK Client
 *
 * @example
 * ```typescript
 * import { LetoClient } from '@feather-it/partner-sdk';
 *
 * const client = new LetoClient({
 *   tenantId: 'your-tenant-id',
 *   serviceToken: 'your-service-token',
 * });
 *
 * // Check domain availability
 * const result = await client.domains.check('example.kr');
 *
 * // Register a domain
 * const domain = await client.domains.register({
 *   domain: 'example.kr',
 *   period: 1,
 *   nameservers: ['ns1.example.com', 'ns2.example.com'],
 *   contact: {
 *     registrant: 'contact-uuid',
 *     administrative: 'contact-uuid',
 *   },
 * });
 * ```
 */
export class LetoClient {
  private readonly httpClient: HttpClient;

  /**
   * Domain management operations
   */
  public readonly domains: Domains;

  /**
   * Contact management operations
   */
  public readonly contacts: Contacts;

  /**
   * Domain transfer operations
   */
  public readonly transfers: Transfers;

  /**
   * TLD pricing and rules
   */
  public readonly tlds: TLDs;

  /**
   * Transaction queries
   */
  public readonly transactions: Transactions;

  /**
   * Account status and balance
   */
  public readonly account: Account;

  /**
   * Create a new LETO SDK client
   *
   * @param config - SDK configuration
   * @throws {Error} If required configuration is missing
   */
  constructor(config: LetoConfig) {
    if (!config.tenantId) {
      throw new Error('tenantId is required');
    }
    if (!config.serviceToken) {
      throw new Error('serviceToken is required');
    }

    this.httpClient = new HttpClient(config);

    // Initialize resource modules
    this.domains = new Domains(this.httpClient);
    this.contacts = new Contacts(this.httpClient);
    this.transfers = new Transfers(this.httpClient);
    this.tlds = new TLDs(this.httpClient);
    this.transactions = new Transactions(this.httpClient);
    this.account = new Account(this.httpClient);
  }
}

// Export all types
export * from './types';
export { LetoApiError } from './client/http-client';

// Default export
export default LetoClient;
