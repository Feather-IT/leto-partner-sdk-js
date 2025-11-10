# LETO Partner SDK for JavaScript/TypeScript

Official JavaScript/TypeScript SDK for the LETO Domain Reseller API.
To use the LETO Partner SDK, you must join the LETO Partner Program.
You can join the LETO Partner Program at LETO Partner. (Currently unavailable; please contact sales@feather-it.com for inquiries.)

## Installation

```bash
npm install @feather-it/partner-sdk
```

or with yarn:

```bash
yarn add @feather-it/partner-sdk
```

## Quick Start

```typescript
import { LetoClient } from '@feather-it/partner-sdk';

// Initialize the client
const client = new LetoClient({
  tenantId: 'your-tenant-id',
  serviceToken: 'your-service-token',
});

// Check domain availability
const availability = await client.domains.check('example.kr');
console.log(availability.available); // true or false

// Create a contact
const contact = await client.contacts.create({
  name: {
    national: '홍길동',
    international: 'Hong Gil Dong',
  },
  email: 'hong@example.com',
  phone: '+82-2-1234-5678',
  mobile: '+82-10-1234-5678',
  address: {
    postalCode: '06234',
    national: {
      state: '서울특별시',
      city: '강남구',
      street: '테헤란로 128',
      detail: '3층',
    },
    international: {
      state: 'Seoul',
      city: 'Gangnam-gu',
      street: '128 Teheran-ro',
      detail: '3F',
    },
  },
  country: 'KR',
  additionalContactData: {
    ctfyCode: '020', // Required for KR domains
  },
});

// Register a domain
const domain = await client.domains.register({
  domain: 'example.kr',
  period: 1,
  nameservers: ['ns1.example.com', 'ns2.example.com'],
  contact: {
    registrant: contact.uuid!,
    administrative: contact.uuid!,
  },
});

console.log(`Domain registered: ${domain.domainName}`);
```

## Configuration

### LetoConfig

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `tenantId` | string | Yes | - | Your LETO tenant ID |
| `serviceToken` | string | Yes | - | Your service token from partner portal |
| `baseUrl` | string | No | `https://api.leto.kr` | API base URL |
| `timeout` | number | No | `30000` | Request timeout in milliseconds |
| `retries` | number | No | `3` | Number of retry attempts |

## API Reference

### Domains

#### Check Domain Availability

```typescript
const result = await client.domains.check('example.kr');
// Returns: { domain: string, available: boolean, price?: number, currency?: string }
```

#### Register Domain

```typescript
const domain = await client.domains.register({
  domain: 'example.kr',
  period: 1, // years
  nameservers: ['ns1.example.com', 'ns2.example.com'],
  contact: {
    registrant: 'contact-uuid',
    administrative: 'contact-uuid',
    technical: 'contact-uuid', // optional
    billing: 'contact-uuid', // optional
  },
});
```

#### List Domains

```typescript
const response = await client.domains.list({
  page: 1,
  size: 20,
  status: 'active',
  search: 'example',
});
// Returns paginated list with response.data, response.pagination
```

#### Get Domain Details

```typescript
const domain = await client.domains.get('example.kr');
```

#### Delete Domain

```typescript
await client.domains.delete('example.kr');
// Note: Only supported for limited TLDs
```

#### Get WHOIS Information

```typescript
const whois = await client.domains.whois('example.kr');
```

### Domain Lock Management

#### Get All Lock Statuses

```typescript
const locks = await client.domains.getLocks('example.kr');
// Returns: { transferLock: boolean, transferAutoReject: boolean, updateLock: boolean }
```

#### Transfer Lock

```typescript
// Get transfer lock status
const status = await client.domains.getTransferLock('example.kr');

// Set transfer lock
await client.domains.setTransferLock('example.kr', true); // lock
await client.domains.setTransferLock('example.kr', false); // unlock
```

#### Transfer Auto-Reject

```typescript
// Get auto-reject status
const status = await client.domains.getTransferAutoReject('example.kr');

// Set auto-reject
await client.domains.setTransferAutoReject('example.kr', true);
```

#### Update Lock

```typescript
// Get update lock status
const status = await client.domains.getUpdateLock('example.kr');

// Set update lock
await client.domains.setUpdateLock('example.kr', true);
```

### Authorization Code

```typescript
// Get auth code
const authCode = await client.domains.getAuthCode('example.kr');
console.log(authCode.code);
console.log(authCode.base64);

// Change auth code
const newAuthCode = await client.domains.changeAuthCode('example.kr');
```

### Nameservers

```typescript
// Get nameservers
const nameservers = await client.domains.getNameservers('example.kr');

// Update nameservers (2-5 nameservers required)
await client.domains.updateNameservers('example.kr', [
  'ns1.example.com',
  'ns2.example.com',
]);
```

### Domain Contacts

```typescript
// Get domain contacts
const contacts = await client.domains.getContact('example.kr');

// Update domain contacts
await client.domains.updateContact('example.kr', {
  registrant: 'new-contact-uuid',
  administrative: 'new-contact-uuid',
});
```

### Domain Renewal

```typescript
// Renew domain (limited to once per day)
const renewal = await client.domains.renew('example.kr', { period: 1 });

// Get renewal history
const renewals = await client.domains.getRenewalHistory('example.kr');

// Cancel renewal (limited TLDs only)
await client.domains.cancelRenewal('example.kr', 'renewal-uuid');
```

### DNSSEC

```typescript
// Get DNSSEC settings
const dnssec = await client.domains.getDNSSEC('example.kr');

// Configure DNSSEC
await client.domains.configureDNSSEC('example.kr', {
  dsData: [
    {
      algorithm: 8,
      digest: 'digest-hash',
      digestType: 2,
      keyTag: 12345,
    },
  ],
});
```

### Contacts

#### Create Contact

```typescript
const contact = await client.contacts.create({
  name: {
    national: '홍길동',
    international: 'Hong Gil Dong',
  },
  email: 'hong@example.com',
  phone: '+82-2-1234-5678',
  mobile: '+82-10-1234-5678',
  fax: '+82-2-1234-5679', // optional
  address: {
    postalCode: '06234',
    national: {
      state: '서울특별시',
      city: '강남구',
      street: '테헤란로 128',
      detail: '3층',
    },
    international: {
      state: 'Seoul',
      city: 'Gangnam-gu',
      street: '128 Teheran-ro',
      detail: '3F',
    },
  },
  country: 'KR',
  additionalContactData: {
    ctfyCode: '020', // Required for KR domains (KISA certification code)
  },
  description: 'Contact description', // optional
});
```

#### List Contacts

```typescript
const response = await client.contacts.list({
  page: 1,
  size: 20,
});
// Returns paginated list
```

### Transfers

#### Verify Authorization Code

```typescript
const result = await client.transfers.verifyAuthCode({
  domain: 'example.com',
  authCode: 'auth-code-here',
});
console.log(result.valid); // true or false
```

#### Initiate Transfer

```typescript
const transfer = await client.transfers.initiate({
  domain: 'example.com',
  authCode: 'auth-code-here',
  period: 1, // optional, years to add
  nameservers: ['ns1.example.com', 'ns2.example.com'], // optional
  contact: {
    // optional
    registrant: 'contact-uuid',
    administrative: 'contact-uuid',
  },
});
```

#### Get Transfer Status

```typescript
const transfer = await client.transfers.get('transfer-uuid');
console.log(transfer.status); // pending, in_progress, completed, failed, rejected
console.log(transfer.direction); // in or out
```

### TLDs

#### List All TLDs

```typescript
const tlds = await client.tlds.list();
// Returns array of all TLDs with pricing and rules
```

#### Get Specific TLD

```typescript
const tld = await client.tlds.get('kr');
console.log(tld.prices.registration);
console.log(tld.prices.renewal);
console.log(tld.prices.transfer);
console.log(tld.rules);
```

### Transactions

```typescript
const response = await client.transactions.list({
  page: 1,
  size: 20,
  type: 'registration', // registration, renewal, transfer, deletion
  status: 'completed', // pending, processing, completed, failed, refunded
  startDate: '2025-01-01',
  endDate: '2025-12-31',
});
```

### Account

```typescript
const status = await client.account.getStatus();
console.log(status.tenantId);
console.log(status.status); // ACTIVE or SUSPENDED
console.log(status.balance.amount);
console.log(status.balance.currency);
```

## Error Handling

The SDK throws `LetoApiError` for API errors:

```typescript
import { LetoClient, LetoApiError } from '@feather-it/partner-sdk';

try {
  await client.domains.register({
    domain: 'example.kr',
    // ... other fields
  });
} catch (error) {
  if (error instanceof LetoApiError) {
    console.error('API Error:', error.message);
    console.error('Error Code:', error.code);
    console.error('Timestamp:', error.timestamp);
    console.error('Status Code:', error.statusCode);
    console.error('Data:', error.data);
  } else {
    console.error('Network or other error:', error);
  }
}
```

## TypeScript Support

This SDK is written in TypeScript and provides full type definitions:

```typescript
import {
  LetoClient,
  Domain,
  Contact,
  Transfer,
  TLD,
  Transaction,
  DomainStatus,
  TransferStatus,
} from '@feather-it/partner-sdk';

// All types are fully typed
const domain: Domain = await client.domains.get('example.kr');
const contact: Contact = await client.contacts.create({ /* ... */ });
```

## Requirements

- Node.js >= 16.0.0
- TypeScript >= 5.0.0 (for TypeScript projects)

## License

MIT

## Support

For API support, please contact your Account Manager or reach out via the dedicated Slack channel.

## Important Notes

- Domain renewal is limited to once per day per domain
- DNSSEC is currently only available for KR domains and may not work in some cases
- Domain deletion is only supported for limited TLDs
- Some operations require specific TLD support (check TLD rules first)
- KR domains require KISA certification code (`ctfyCode`) in contact's `additionalContactData`

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Lint
npm run lint

# Format
npm run format
```
