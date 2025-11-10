import { HttpClient } from '../client/http-client';
import {
  ApiResponse,
  Domain,
  DomainCheckResult,
  DomainRegistrationRequest,
  DomainListQuery,
  DomainContactIds,
  LockStatus,
  TransferLockStatus,
  TransferAutoRejectStatus,
  UpdateLockStatus,
  AuthCode,
  DomainRenewalRequest,
  DomainRenewal,
  DNSSEC,
  DNSSECUpdate,
  WhoisInfo,
} from '../types';

/**
 * Domain Management Resource
 * Handles all domain-related operations
 */
export class Domains {
  constructor(private readonly client: HttpClient) {}

  /**
   * Check domain availability
   * @param domain - Domain name to check (e.g., "example.kr")
   */
  async check(domain: string): Promise<DomainCheckResult> {
    const response = await this.client.get<DomainCheckResult>(
      '/api/v1/domains/check',
      { domain }
    );
    return response.data;
  }

  /**
   * Register a new domain
   * @param request - Domain registration details
   */
  async register(request: DomainRegistrationRequest): Promise<Domain> {
    const response = await this.client.post<Domain>('/api/v1/domains', request);
    return response.data;
  }

  /**
   * List all domains
   * @param query - Query parameters for filtering and pagination
   */
  async list(query?: DomainListQuery): Promise<ApiResponse<Domain[]>> {
    return await this.client.get<Domain[]>('/api/v1/domains', query);
  }

  /**
   * Get domain details
   * @param domainName - Domain name (e.g., "example.kr")
   */
  async get(domainName: string): Promise<Domain> {
    const response = await this.client.get<Domain>(
      `/api/v1/domains/${domainName}`
    );
    return response.data;
  }

  /**
   * Delete a domain (limited TLDs only)
   * @param domainName - Domain name to delete
   */
  async delete(domainName: string): Promise<void> {
    await this.client.delete(`/api/v1/domains/${domainName}`);
  }

  /**
   * Get WHOIS information for a domain
   * @param domainName - Domain name
   */
  async whois(domainName: string): Promise<WhoisInfo> {
    const response = await this.client.get<WhoisInfo>(
      `/api/v1/domains/${domainName}/whois`
    );
    return response.data;
  }

  // ============================================================================
  // Lock Status Management
  // ============================================================================

  /**
   * Get all lock statuses for a domain
   * @param domainName - Domain name
   */
  async getLocks(domainName: string): Promise<LockStatus> {
    const response = await this.client.get<LockStatus>(
      `/api/v1/domains/${domainName}/locks`
    );
    return response.data;
  }

  /**
   * Get transfer lock status
   * @param domainName - Domain name
   */
  async getTransferLock(domainName: string): Promise<TransferLockStatus> {
    const response = await this.client.get<TransferLockStatus>(
      `/api/v1/domains/${domainName}/transferLock`
    );
    return response.data;
  }

  /**
   * Set transfer lock status
   * @param domainName - Domain name
   * @param locked - Lock status (true to lock, false to unlock)
   */
  async setTransferLock(domainName: string, locked: boolean): Promise<TransferLockStatus> {
    const response = await this.client.put<TransferLockStatus>(
      `/api/v1/domains/${domainName}/transferLock`,
      { transferLock: locked }
    );
    return response.data;
  }

  /**
   * Get transfer auto-reject status
   * @param domainName - Domain name
   */
  async getTransferAutoReject(domainName: string): Promise<TransferAutoRejectStatus> {
    const response = await this.client.get<TransferAutoRejectStatus>(
      `/api/v1/domains/${domainName}/transferAutoReject`
    );
    return response.data;
  }

  /**
   * Set transfer auto-reject status
   * @param domainName - Domain name
   * @param autoReject - Auto-reject status (true to enable, false to disable)
   */
  async setTransferAutoReject(
    domainName: string,
    autoReject: boolean
  ): Promise<TransferAutoRejectStatus> {
    const response = await this.client.put<TransferAutoRejectStatus>(
      `/api/v1/domains/${domainName}/transferAutoReject`,
      { transferAutoReject: autoReject }
    );
    return response.data;
  }

  /**
   * Get update lock status
   * @param domainName - Domain name
   */
  async getUpdateLock(domainName: string): Promise<UpdateLockStatus> {
    const response = await this.client.get<UpdateLockStatus>(
      `/api/v1/domains/${domainName}/updateLock`
    );
    return response.data;
  }

  /**
   * Set update lock status
   * @param domainName - Domain name
   * @param locked - Lock status (true to lock, false to unlock)
   */
  async setUpdateLock(domainName: string, locked: boolean): Promise<UpdateLockStatus> {
    const response = await this.client.put<UpdateLockStatus>(
      `/api/v1/domains/${domainName}/updateLock`,
      { updateLock: locked }
    );
    return response.data;
  }

  // ============================================================================
  // Authorization Code
  // ============================================================================

  /**
   * Get authorization code for domain transfer
   * @param domainName - Domain name
   */
  async getAuthCode(domainName: string): Promise<AuthCode> {
    const response = await this.client.get<AuthCode>(
      `/api/v1/domains/${domainName}/transfer/auth-code`
    );
    return response.data;
  }

  /**
   * Change authorization code
   * @param domainName - Domain name
   */
  async changeAuthCode(domainName: string): Promise<AuthCode> {
    const response = await this.client.put<AuthCode>(
      `/api/v1/domains/${domainName}/transfer/auth-code`
    );
    return response.data;
  }

  // ============================================================================
  // Nameservers
  // ============================================================================

  /**
   * Get nameservers for a domain
   * @param domainName - Domain name
   */
  async getNameservers(domainName: string): Promise<string[]> {
    const response = await this.client.get<{ nameservers: string[] }>(
      `/api/v1/domains/${domainName}/nameservers`
    );
    return response.data.nameservers;
  }

  /**
   * Update nameservers for a domain
   * @param domainName - Domain name
   * @param nameservers - Array of nameserver hostnames (2-5 nameservers required)
   */
  async updateNameservers(
    domainName: string,
    nameservers: string[]
  ): Promise<string[]> {
    const response = await this.client.put<{ nameservers: string[] }>(
      `/api/v1/domains/${domainName}/nameservers`,
      { nameservers }
    );
    return response.data.nameservers;
  }

  // ============================================================================
  // Contact Management
  // ============================================================================

  /**
   * Get domain contacts
   * @param domainName - Domain name
   */
  async getContact(domainName: string): Promise<DomainContactIds> {
    const response = await this.client.get<DomainContactIds>(
      `/api/v1/domains/${domainName}/contact`
    );
    return response.data;
  }

  /**
   * Update domain contacts
   * @param domainName - Domain name
   * @param contacts - Contact IDs to update
   */
  async updateContact(
    domainName: string,
    contacts: DomainContactIds
  ): Promise<DomainContactIds> {
    const response = await this.client.put<DomainContactIds>(
      `/api/v1/domains/${domainName}/contact`,
      contacts
    );
    return response.data;
  }

  // ============================================================================
  // Domain Renewal
  // ============================================================================

  /**
   * Renew a domain (limited to once per day per domain)
   * @param domainName - Domain name
   * @param request - Renewal details (period in years)
   */
  async renew(
    domainName: string,
    request: DomainRenewalRequest
  ): Promise<DomainRenewal> {
    const response = await this.client.post<DomainRenewal>(
      `/api/v1/domains/${domainName}/renewal`,
      request
    );
    return response.data;
  }

  /**
   * Get renewal history for a domain
   * @param domainName - Domain name
   */
  async getRenewalHistory(domainName: string): Promise<DomainRenewal[]> {
    const response = await this.client.get<DomainRenewal[]>(
      `/api/v1/domains/${domainName}/renewal`
    );
    return response.data;
  }

  /**
   * Cancel a renewal (limited TLDs only)
   * @param domainName - Domain name
   * @param renewalId - Renewal ID to cancel
   */
  async cancelRenewal(domainName: string, renewalId: string): Promise<void> {
    await this.client.delete(
      `/api/v1/domains/${domainName}/renewal/${renewalId}`
    );
  }

  // ============================================================================
  // DNSSEC
  // Korean: 이 기능은 현재 KR 도메인만 제공하며 -
  // DNSSEC가 작동하지 않는 경우가 존재합니다. 이 점 유의하여 사용하시길 권장합니다.
  // ============================================================================

  /**
   * Get DNSSEC settings for a domain
   * @param domainName - Domain name
   */
  async getDNSSEC(domainName: string): Promise<DNSSEC[]> {
    const response = await this.client.get<{ dsData: DNSSEC[] }>(
      `/api/v1/domains/${domainName}/dnssec`
    );
    return response.data.dsData;
  }

  /**
   * Configure DNSSEC for a domain
   * @param domainName - Domain name
   * @param dnssec - DNSSEC configuration
   */
  async configureDNSSEC(
    domainName: string,
    dnssec: DNSSECUpdate
  ): Promise<DNSSEC[]> {
    const response = await this.client.post<{ dsData: DNSSEC[] }>(
      `/api/v1/domains/${domainName}/dnssec`,
      dnssec
    );
    return response.data.dsData;
  }
}
