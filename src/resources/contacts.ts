import { HttpClient } from '../client/http-client';
import {
  ApiResponse,
  Contact,
  ContactCreateRequest,
  ContactListQuery,
} from '../types';

/**
 * Contact Management Resource
 * Handles contact creation and retrieval
 */
export class Contacts {
  constructor(private readonly client: HttpClient) {}

  /**
   * Create a new contact
   * @param request - Contact details
   * @returns Created contact with UUID
   */
  async create(request: ContactCreateRequest): Promise<Contact> {
    const response = await this.client.post<Contact>('/api/v1/contacts', request);
    return response.data;
  }

  /**
   * List all contacts with pagination
   * @param query - Query parameters for pagination
   * @returns Paginated list of contacts
   */
  async list(query?: ContactListQuery): Promise<ApiResponse<Contact[]>> {
    return await this.client.get<Contact[]>('/api/v1/contacts', query);
  }
}
