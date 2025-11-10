/**
 * Basic usage example for LETO Partner SDK
 *
 * To run this example:
 * 1. Set environment variables: LETO_TENANT_ID and LETO_SERVICE_TOKEN
 * 2. npm run build
 * 3. node dist/examples/basic-usage.js
 */

import { LetoClient, LetoApiError } from '../src';

async function main() {
  // Initialize client
  const client = new LetoClient({
    tenantId: process.env.LETO_TENANT_ID || 'your-tenant-id',
    serviceToken: process.env.LETO_SERVICE_TOKEN || 'your-service-token',
  });

  try {
    // 1. Check account status
    console.log('1. Checking account status...');
    const accountStatus = await client.account.getStatus();
    console.log('Account Status:', accountStatus.status);
    console.log('Balance:', accountStatus.balance);

    // 2. Get TLD pricing
    console.log('\n2. Getting KR domain pricing...');
    const krTld = await client.tlds.get('kr');
    console.log('KR Domain Prices:', krTld.prices);
    console.log('KR Domain Rules:', krTld.rules);

    // 3. Check domain availability
    console.log('\n3. Checking domain availability...');
    const domainToCheck = 'example-test-' + Date.now() + '.kr';
    const availability = await client.domains.check(domainToCheck);
    console.log(`Domain ${availability.domain} available:`, availability.available);

    if (availability.available) {
      // 4. Create a contact
      console.log('\n4. Creating contact...');
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
          ctfyCode: '020',
        },
        description: 'Test contact',
      });
      console.log('Contact created:', contact.uuid);

      // 5. Register domain (commented out to avoid actual registration)
      /*
      console.log('\n5. Registering domain...');
      const domain = await client.domains.register({
        domain: domainToCheck,
        period: 1,
        nameservers: ['ns1.example.com', 'ns2.example.com'],
        contact: {
          registrant: contact.uuid!,
          administrative: contact.uuid!,
        },
      });
      console.log('Domain registered:', domain.domainName);
      console.log('Expires at:', domain.expiresAt.date);
      */
    }

    // 6. List domains
    console.log('\n6. Listing domains...');
    const domainsResponse = await client.domains.list({
      page: 1,
      size: 10,
    });
    console.log(`Total domains: ${domainsResponse.pagination?.total || 0}`);
    if (domainsResponse.data.length > 0) {
      console.log('First domain:', domainsResponse.data[0].domainName);

      // 7. Get domain details
      const domainName = domainsResponse.data[0].domainName;
      console.log(`\n7. Getting details for ${domainName}...`);
      const domain = await client.domains.get(domainName);
      console.log('Domain status:', domain.status);
      console.log('Nameservers:', domain.nameservers);
      console.log('Transfer lock:', domain.transferLock);

      // 8. Get nameservers
      console.log(`\n8. Getting nameservers for ${domainName}...`);
      const nameservers = await client.domains.getNameservers(domainName);
      console.log('Nameservers:', nameservers);

      // 9. Get lock status
      console.log(`\n9. Getting lock status for ${domainName}...`);
      const locks = await client.domains.getLocks(domainName);
      console.log('Lock status:', locks);
    }

    // 10. List contacts
    console.log('\n10. Listing contacts...');
    const contactsResponse = await client.contacts.list({ page: 1, size: 5 });
    console.log(`Total contacts: ${contactsResponse.pagination?.total || 0}`);

    // 11. List transactions
    console.log('\n11. Listing recent transactions...');
    const transactionsResponse = await client.transactions.list({
      page: 1,
      size: 5,
    });
    console.log(
      `Total transactions: ${transactionsResponse.pagination?.total || 0}`
    );

    console.log('\n✅ All operations completed successfully!');
  } catch (error) {
    if (error instanceof LetoApiError) {
      console.error('\n❌ LETO API Error:');
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      console.error('Status Code:', error.statusCode);
      console.error('Data:', error.data);
    } else {
      console.error('\n❌ Error:', error);
    }
    process.exit(1);
  }
}

main();
