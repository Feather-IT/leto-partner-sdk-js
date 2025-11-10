/**
 * LETO Partner SDK Type Definitions
 * API Version: v1
 */

// ============================================================================
// Common Types
// ============================================================================

export interface Timestamp {
  timestamp: number;
  date: string;
}

export interface ApiResponse<T = any> {
  code: string;
  message: string;
  data: T;
  timestamp: string;
  success: boolean;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

// ============================================================================
// Domain Types
// ============================================================================

export type DomainStatus =
  | 'active'
  | 'pending'
  | 'expired'
  | 'suspended'
  | 'deleted'
  | 'failed'
  | 'client_transfer_prohibited'
  | 'server_transfer_prohibited';

export interface Domain {
  uuid: string;
  tenantId: string;
  domainName: string;
  status: DomainStatus;
  expiresAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  nameservers: string[];
  authcode: {
    code: string;
    base64: string;
  };
  transferLock: boolean;
  transferAutoReject: boolean;
  updateLock: boolean;
  contact: DomainContactFull;
  contactId: DomainContactIds;
  metadata: Record<string, any>;
}

export interface DomainCheckResult {
  domain: string;
  available: boolean;
  price?: number;
  currency?: string;
}

export interface DomainRegistrationRequest {
  domain: string;
  period: number;
  nameservers: string[];
  contact: DomainContactIds;
}

export interface DomainContactIds {
  registrant: string;
  administrative: string;
  technical?: string;
  billing?: string;
}

export interface DomainContactFull {
  registrant: Contact;
  administrative: Contact;
  technical?: Contact;
  billing?: Contact;
}

export interface DomainListQuery {
  page?: number;
  size?: number;
  status?: DomainStatus;
  search?: string;
}

// ============================================================================
// Contact Types
// ============================================================================

export interface Contact {
  uuid?: string;
  tenantId?: string;
  name: ContactName;
  email: string;
  phone: string;
  mobile: string;
  fax?: string;
  address: ContactAddress;
  country: string;
  additionalContactData?: AdditionalContactData;
  description?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ContactName {
  national: string;
  international: string;
}

export interface ContactAddress {
  postalCode: string;
  national: ContactAddressDetail;
  international: ContactAddressDetail;
}

export interface ContactAddressDetail {
  state: string;
  city: string;
  street: string;
  detail?: string;
}

export interface AdditionalContactData {
  ctfyCode?: string; // KISA certification code for KR domains
  [key: string]: any;
}

export interface ContactCreateRequest {
  name: ContactName;
  email: string;
  phone: string;
  mobile: string;
  fax?: string;
  address: ContactAddress;
  country: string;
  additionalContactData?: AdditionalContactData;
  description?: string;
}

export interface ContactListQuery {
  page?: number;
  size?: number;
}

// ============================================================================
// TLD & Pricing Types
// ============================================================================

export interface TLD {
  tld: string;
  priority: number;
  prices: TLDPrices;
  currency: string;
  features?: {
    supportsTransfer: boolean;
    supportsDeletion: boolean;
  };
  rules: TLDRules;
}

export interface TLDPrices {
  registration: number;
  renewal: number;
  transfer: number;
}

export interface TLDRules {
  registration: {
    min: number;
    max: number;
  };
  renewal: {
    min: number;
    max: number;
  };
  transfer: {
    min: number;
    max: number;
  };
  contactTypes: string[];
  nameservers: {
    min: number;
    max: number;
  };
  additionalContactData?: string[];
}

// ============================================================================
// Domain Features Types
// ============================================================================

export interface LockStatus {
  transferLock: boolean;
  transferAutoReject: boolean;
  updateLock: boolean;
}

export interface TransferLockStatus {
  transferLock: boolean;
}

export interface TransferAutoRejectStatus {
  transferAutoReject: boolean;
}

export interface UpdateLockStatus {
  updateLock: boolean;
}

export interface AuthCode {
  code: string;
  base64: string;
}

export interface NameserversUpdate {
  nameservers: string[];
}

// ============================================================================
// Domain Renewal Types
// ============================================================================

export interface DomainRenewalRequest {
  period: number;
}

export interface DomainRenewal {
  renewalId: string;
  domainName: string;
  period: number;
  price: number;
  currency: string;
  status: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
}

// ============================================================================
// DNSSEC Types
// ============================================================================

export interface DNSSEC {
  algorithm: number;
  digest: string;
  digestType: number;
  keyTag: number;
}

export interface DNSSECUpdate {
  dsData: DNSSEC[];
}

// ============================================================================
// Transfer Types
// ============================================================================

export type TransferStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'rejected';

export type TransferDirection = 'in' | 'out';

export interface Transfer {
  transferId: string;
  transactionId: string;
  status: TransferStatus;
  direction: TransferDirection;
  domainName: string;
  fromRegistrar?: string;
  toRegistrar?: string;
  nameservers: string[];
  createdDate: Timestamp;
  updatedDate: Timestamp;
  expiredDate: Timestamp;
  authCode?: string;
}

export interface TransferAuthCodeVerifyRequest {
  domain: string;
  authCode: string;
}

export interface TransferAuthCodeVerifyResult {
  valid: boolean;
  domain: string;
  expiresAt?: Timestamp;
  registrar?: string;
}

export interface TransferInitiateRequest {
  domain: string;
  authCode: string;
  period?: number;
  nameservers?: string[];
  contact?: DomainContactIds;
}

// ============================================================================
// Transaction Types
// ============================================================================

export type TransactionType =
  | 'registration'
  | 'renewal'
  | 'transfer'
  | 'deletion';

export type TransactionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface Transaction {
  transactionId: string;
  tenantId: string;
  type: TransactionType;
  domainName: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  createdAt: Timestamp;
  completedAt?: Timestamp;
  metadata?: Record<string, any>;
}

export interface TransactionListQuery {
  page?: number;
  size?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Account Types
// ============================================================================

export type AccountStatus = 'ACTIVE' | 'SUSPENDED';

export interface AccountStatusResponse {
  tenantId: string;
  status: AccountStatus;
  createdAt: string;
  expiresAt: string | null;
  balance: {
    amount: string;
    currency: string;
  };
}

// ============================================================================
// WHOIS Types
// ============================================================================

export interface WhoisInfo {
  domainName: string;
  registrar: string;
  registrant: string;
  createdDate: string;
  expiresDate: string;
  updatedDate: string;
  status: string[];
  nameservers: string[];
  dnssec: string;
  rawWhois?: string;
}

// ============================================================================
// SDK Configuration
// ============================================================================

export interface LetoConfig {
  tenantId: string;
  serviceToken: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}
