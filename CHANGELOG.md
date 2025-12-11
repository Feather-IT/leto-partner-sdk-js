## 1.0.1 - 2025-12-11

- Remove `retries` option from `HttpClient`/`LetoConfig` to match current API behavior.
- Align pagination responses for TLDs/transfers; add transfer list helper and broaden transfer status/types to mirror domain-api responses.
- Make domain contact optional in SDK type and relax TLD `additionalContactData` typing for API flexibility.
- Update README usage notes for pagination and transfer status wording.
