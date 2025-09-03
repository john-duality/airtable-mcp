import { AirtableClientWrapper } from './airtable-client-wrapper.js';

export const list_of_tools = [
  {
    name: "get_base_info",
    description: "Get information about the Airtable base",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "list_tables",
    description: "List all tables in the Airtable base",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "get_table_info",
    description: "Get detailed information about a specific table",
    inputSchema: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table to get information about"
        }
      },
      required: ["tableId"]
    }
  },
  {
    name: "list_records",
    description: "List records from a table with optional filtering and pagination",
    inputSchema: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table to list records from"
        },
        pageSize: {
          type: "number",
          description: "Number of records to return (max 100)"
        },
        offset: {
          type: "string",
          description: "Pagination offset token"
        },
        filterByFormula: {
          type: "string",
          description: "Airtable formula to filter records"
        },
        sort: {
          type: "array",
          items: {
            type: "object",
            properties: {
              field: { type: "string" },
              direction: { type: "string", enum: ["asc", "desc"] }
            },
            required: ["field"]
          },
          description: "Sorting configuration"
        },
        fields: {
          type: "array",
          items: { type: "string" },
          description: "Specific fields to return"
        },
        view: {
          type: "string",
          description: "View ID to use for the query"
        }
      },
      required: ["tableId"]
    }
  },
  {
    name: "get_record",
    description: "Get a specific record by ID",
    inputSchema: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table containing the record"
        },
        recordId: {
          type: "string",
          description: "The ID of the record to retrieve"
        }
      },
      required: ["tableId", "recordId"]
    }
  },
  {
    name: "create_record",
    description: "Create a new record in a table",
    inputSchema: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table to create the record in"
        },
        fields: {
          type: "object",
          description: "The field values for the new record"
        }
      },
      required: ["tableId", "fields"]
    }
  },
  {
    name: "update_record",
    description: "Update an existing record",
    inputSchema: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table containing the record"
        },
        recordId: {
          type: "string",
          description: "The ID of the record to update"
        },
        fields: {
          type: "object",
          description: "The field values to update"
        }
      },
      required: ["tableId", "recordId", "fields"]
    }
  },
  {
    name: "delete_record",
    description: "Delete a record from a table",
    inputSchema: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table containing the record"
        },
        recordId: {
          type: "string",
          description: "The ID of the record to delete"
        }
      },
      required: ["tableId", "recordId"]
    }
  },
  {
    name: "create_records",
    description: "Create multiple records in a table (batch operation)",
    inputSchema: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table to create records in"
        },
        records: {
          type: "array",
          items: {
            type: "object",
            properties: {
              fields: {
                type: "object",
                description: "The field values for the record"
              }
            },
            required: ["fields"]
          },
          description: "Array of records to create (max 10)"
        }
      },
      required: ["tableId", "records"]
    }
  },
  {
    name: "update_records",
    description: "Update multiple records in a table (batch operation)",
    inputSchema: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table containing the records"
        },
        records: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              fields: {
                type: "object",
                description: "The field values to update"
              }
            },
            required: ["id", "fields"]
          },
          description: "Array of records to update (max 10)"
        }
      },
      required: ["tableId", "records"]
    }
  },
  {
    name: "delete_records",
    description: "Delete multiple records from a table (batch operation)",
    inputSchema: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table containing the records"
        },
        recordIds: {
          type: "array",
          items: { type: "string" },
          description: "Array of record IDs to delete (max 10)"
        }
      },
      required: ["tableId", "recordIds"]
    }
  },
  {
    name: "list_views",
    description: "List all views for a specific table",
    inputSchema: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table to list views for"
        }
      },
      required: ["tableId"]
    }
  },
  {
    name: "get_view_info",
    description: "Get detailed information about a specific view",
    inputSchema: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table containing the view"
        },
        viewId: {
          type: "string",
          description: "The ID of the view to get information about"
        }
      },
      required: ["tableId", "viewId"]
    }
  },
  {
    name: "list_fields",
    description: "List all fields for a specific table",
    inputSchema: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table to list fields for"
        }
      },
      required: ["tableId"]
    }
  },
  {
    name: "get_field_info",
    description: "Get detailed information about a specific field",
    inputSchema: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table containing the field"
        },
        fieldId: {
          type: "string",
          description: "The ID of the field to get information about"
        }
      },
      required: ["tableId", "fieldId"]
    }
  }
];

export async function tool_handler(
  tool_name: string,
  arguments_: any,
  airtableClient: AirtableClientWrapper
): Promise<any> {
  try {
    switch (tool_name) {
      case "get_base_info":
        return await airtableClient.getBaseInfo();

      case "list_tables":
        return await airtableClient.listTables();

      case "get_table_info":
        return await airtableClient.getTableInfo(arguments_.tableId);

      case "list_records":
        return await airtableClient.listRecords(arguments_.tableId, {
          pageSize: arguments_.pageSize,
          offset: arguments_.offset,
          filterByFormula: arguments_.filterByFormula,
          sort: arguments_.sort,
          fields: arguments_.fields,
          view: arguments_.view
        });

      case "get_record":
        return await airtableClient.getRecord(arguments_.tableId, arguments_.recordId);

      case "create_record":
        return await airtableClient.createRecord(arguments_.tableId, arguments_.fields);

      case "update_record":
        return await airtableClient.updateRecord(arguments_.tableId, arguments_.recordId, arguments_.fields);

      case "delete_record":
        return await airtableClient.deleteRecord(arguments_.tableId, arguments_.recordId);

      case "create_records":
        return await airtableClient.createRecords(arguments_.tableId, arguments_.records);

      case "update_records":
        return await airtableClient.updateRecords(arguments_.tableId, arguments_.records);

      case "delete_records":
        return await airtableClient.deleteRecords(arguments_.tableId, arguments_.recordIds);

      case "list_views":
        return await airtableClient.listViews(arguments_.tableId);

      case "get_view_info":
        return await airtableClient.getViewInfo(arguments_.tableId, arguments_.viewId);

      case "list_fields":
        return await airtableClient.listFields(arguments_.tableId);

      case "get_field_info":
        return await airtableClient.getFieldInfo(arguments_.tableId, arguments_.fieldId);

      default:
        throw new Error(`Unknown tool: ${tool_name}`);
    }
  } catch (error) {
    console.error(`Error in tool handler for ${tool_name}:`, error);
    throw error;
  }
}
