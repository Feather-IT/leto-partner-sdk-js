/**
 * Domain transfer example for LETO Partner SDK
 *
 * To run this example:
 * 1. Set environment variables: LETO_TENANT_ID and LETO_SERVICE_TOKEN
 * 2. npm run build
 * 3. node dist/examples/domain-transfer.js
 */

import { LetoClient, LetoApiError } from '../src';

async function main() {
  const client = new LetoClient({
    tenantId: process.env.LETO_TENANT_ID || 'your-tenant-id',
    serviceToken: process.env.LETO_SERVICE_TOKEN || 'your-service-token',
  });

  const domainToTransfer = 'example.com';
  const authCode = 'your-auth-code-here';

  try {
    // 1. Verify authorization code
    console.log('1. Verifying authorization code...');
    const verifyResult = await client.transfers.verifyAuthCode({
      domain: domainToTransfer,
      authCode: authCode,
    });

    console.log('Verification result:', verifyResult.valid);
    if (verifyResult.valid) {
      console.log('Domain:', verifyResult.domain);
      console.log('Current registrar:', verifyResult.registrar);
      console.log('Expires at:', verifyResult.expiresAt?.date);

      // 2. Create contacts for the domain (if needed)
      console.log('\n2. Creating contact for transfer...');
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
          },
          international: {
            state: 'Seoul',
            city: 'Gangnam-gu',
            street: '128 Teheran-ro',
          },
        },
        country: 'KR',
      });
      console.log('Contact created:', contact.uuid);

      // 3. Initiate transfer
      console.log('\n3. Initiating domain transfer...');
      const transfer = await client.transfers.initiate({
        domain: domainToTransfer,
        authCode: authCode,
        period: 1, // Add 1 year to the domain
        nameservers: ['ns1.example.com', 'ns2.example.com'],
        contact: {
          registrant: contact.uuid!,
          administrative: contact.uuid!,
        },
      });

      console.log('Transfer initiated!');
      console.log('Transfer ID:', transfer.transferId);
      console.log('Status:', transfer.status);
      console.log('Direction:', transfer.direction);

      // 4. Check transfer status
      console.log('\n4. Checking transfer status...');
      const transferStatus = await client.transfers.get(transfer.transferId);
      console.log('Current status:', transferStatus.status);
      console.log('Domain:', transferStatus.domainName);
      console.log('Created:', transferStatus.createdDate.date);
      console.log('Updated:', transferStatus.updatedDate.date);

      if (transferStatus.status === 'completed') {
        console.log('\n✅ Transfer completed successfully!');
      } else if (transferStatus.status === 'failed' || transferStatus.status === 'rejected') {
        console.log('\n❌ Transfer failed or was rejected');
      } else {
        console.log('\n⏳ Transfer is still in progress...');
        console.log('Please check the status later using the transfer ID:', transfer.transferId);
      }
    } else {
      console.log('\n❌ Authorization code is invalid');
    }
  } catch (error) {
    if (error instanceof LetoApiError) {
      console.error('\n❌ LETO API Error:');
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      console.error('Status Code:', error.statusCode);
    } else {
      console.error('\n❌ Error:', error);
    }
    process.exit(1);
  }
}

main();
