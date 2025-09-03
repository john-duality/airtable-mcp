export class AirtableClientWrapper {
  private apiKey: string;
  private baseId: string;

  constructor(apiKey: string, baseId: string) {
    this.apiKey = apiKey;
    this.baseId = baseId;
  }

  private async callAirtableAPI(endpoint: string, method: string = 'GET', body: any = null, queryParams: Record<string, string> = {}): Promise<any> {
    const isBaseEndpoint = !endpoint.startsWith('meta/') && !endpoint.startsWith('bases/');
    const baseUrl = isBaseEndpoint ? `${this.baseId}/${endpoint}` : endpoint;
    
    // Build query string
    const queryString = Object.keys(queryParams).length > 0 
      ? '?' + new URLSearchParams(queryParams).toString() 
      : '';
    
    const url = `https://api.airtable.com/v0/${baseUrl}${queryString}`;
    
    const options: RequestInit = {
      method: method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Airtable API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API call failed: ${method} ${url}`, error);
      throw error;
    }
  }

  // Base operations
  async getBaseInfo(): Promise<any> {
    return this.callAirtableAPI('meta/bases/' + this.baseId);
  }

  async listTables(): Promise<any> {
    return this.callAirtableAPI('meta/bases/' + this.baseId + '/tables');
  }

  async getTableInfo(tableId: string): Promise<any> {
    return this.callAirtableAPI(`meta/bases/${this.baseId}/tables/${tableId}`);
  }

  // Record operations
  async listRecords(tableId: string, options: {
    pageSize?: number;
    offset?: string;
    filterByFormula?: string;
    sort?: Array<{field: string; direction?: 'asc' | 'desc'}>;
    fields?: string[];
    view?: string;
  } = {}): Promise<any> {
    const queryParams: Record<string, string> = {};
    
    if (options.pageSize) queryParams.pageSize = options.pageSize.toString();
    if (options.offset) queryParams.offset = options.offset;
    if (options.filterByFormula) queryParams.filterByFormula = options.filterByFormula;
    if (options.view) queryParams.view = options.view;
    
    if (options.sort && options.sort.length > 0) {
      queryParams.sort = JSON.stringify(options.sort);
    }
    
    if (options.fields && options.fields.length > 0) {
      queryParams.fields = JSON.stringify(options.fields);
    }

    return this.callAirtableAPI(tableId, 'GET', null, queryParams);
  }

  async getRecord(tableId: string, recordId: string): Promise<any> {
    return this.callAirtableAPI(`${tableId}/${recordId}`);
  }

  async createRecord(tableId: string, fields: Record<string, any>): Promise<any> {
    return this.callAirtableAPI(tableId, 'POST', { fields });
  }

  async updateRecord(tableId: string, recordId: string, fields: Record<string, any>): Promise<any> {
    return this.callAirtableAPI(`${tableId}/${recordId}`, 'PATCH', { fields });
  }

  async deleteRecord(tableId: string, recordId: string): Promise<any> {
    return this.callAirtableAPI(`${tableId}/${recordId}`, 'DELETE');
  }

  // Batch operations
  async createRecords(tableId: string, records: Array<{fields: Record<string, any>}>): Promise<any> {
    return this.callAirtableAPI(tableId, 'POST', { records });
  }

  async updateRecords(tableId: string, records: Array<{id: string; fields: Record<string, any>}>): Promise<any> {
    return this.callAirtableAPI(tableId, 'PATCH', { records });
  }

  async deleteRecords(tableId: string, recordIds: string[]): Promise<any> {
    const body = { records: recordIds.map(id => ({ id })) };
    return this.callAirtableAPI(tableId, 'DELETE', body);
  }

  // View operations
  async listViews(tableId: string): Promise<any> {
    return this.callAirtableAPI(`meta/bases/${this.baseId}/tables/${tableId}/views`);
  }

  async getViewInfo(tableId: string, viewId: string): Promise<any> {
    return this.callAirtableAPI(`meta/bases/${this.baseId}/tables/${tableId}/views/${viewId}`);
  }

  // Field operations
  async listFields(tableId: string): Promise<any> {
    return this.callAirtableAPI(`meta/bases/${this.baseId}/tables/${tableId}/fields`);
  }

  async getFieldInfo(tableId: string, fieldId: string): Promise<any> {
    return this.callAirtableAPI(`meta/bases/${this.baseId}/tables/${tableId}/fields/${fieldId}`);
  }
}
