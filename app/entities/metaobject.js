/**
 * Represents a MetaObject with enhanced functionality.
 * @class
 */
export class MetaObject {
  META_OBJECT_PREFIX = "gid://shopify/Metaobject/";
  /**
   * Create a MetaObject instance.
   * @param {Object} admin - The Shopify admin access object.
   */
  constructor(admin) {
    this.admin = admin;
    this.definitionCache = new Map();
  }

  /**
   * Define a new MetaObject.
   * @param {Object} definitionType - The MetaObject definition.
   * @returns {Promise<Object>} The created MetaObject definition.
   * @throws {Error} If required properties are missing or if there's an API error.
   */
  async define(definitionType) {
    const requiredProps = ["name", "type", "access", "fieldDefinitions"];
    const missingProps = requiredProps.filter(
      (prop) => !definitionType.hasOwnProperty(prop),
    );

    if (missingProps.length > 0) {
      throw new Error(
        `Definition required properties: ${missingProps.join(", ")}`,
      );
    }

    const definition = {
      name: definitionType.name,
      type: definitionType.type,
      access: definitionType.access,
      fieldDefinitions: definitionType.fieldDefinitions,
    };

    const mutation = `#graphql
    mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
        metaobjectDefinitionCreate(definition: $definition) {
            metaobjectDefinition {
                name
                type
                fieldDefinitions {
                    name
                    key
                }
            }
            userErrors {
                field
                message
                code
            }
        }
    }`;

    try {
      const response = await this.admin.graphql(mutation, {
        variables: { definition },
      });
      const {
        data: { metaobjectDefinitionCreate },
      } = await response.json();

      if (metaobjectDefinitionCreate.userErrors.length > 0) {
        throw new Error(
          metaobjectDefinitionCreate.userErrors
            .map((e) => e.message)
            .join(", "),
        );
      }

      this.definitionCache.set(
        definitionType.type,
        metaobjectDefinitionCreate.metaobjectDefinition,
      );
      return metaobjectDefinitionCreate.metaobjectDefinition;
    } catch (error) {
      console.error("Error defining MetaObject:", error);
      throw error;
    }
  }

  /**
   * Get the definition of a MetaObject.
   * @param {Object} params - Parameters for getting the definition.
   * @param {string} params.type - The type of the MetaObject.
   * @returns {Promise<Object>} The MetaObject definition.
   * @throws {Error} If the type is missing or if there's an API error.
   */
  async getDefinition({ type }) {
    if (!type) {
      throw new Error(`Definition type is required`);
    }

    if (this.definitionCache.has(type)) {
      return this.definitionCache.get(type);
    }

    const query = `#graphql
    query {
        metaobjectDefinitionByType(type: "${type}") {
            id
            name 
            type
            fieldDefinitions {
                key
                name
            }
        }
    }`;

    try {
      const response = await this.admin.graphql(query);
      const {
        data: { metaobjectDefinitionByType },
      } = await response.json();

      if (!metaobjectDefinitionByType) {
        throw new Error(`No definition found for type: ${type}`);
      }

      this.definitionCache.set(type, metaobjectDefinitionByType);
      return metaobjectDefinitionByType;
    } catch (error) {
      console.error("Error getting MetaObject definition:", error);
      throw error;
    }
  }

  /**
   * Update the definition of a MetaObject.
   * @param {Object} params - Parameters for updating the definition.
   * @param {string} params.type - The type of the MetaObject.
   * @param {Array} newFieldDefinitions - The new field definitions to add.
   * @returns {Promise<Object>} The updated MetaObject definition.
   * @throws {Error} If there's an API error.
   * @example
   */

  async updateDefinition(type, newFieldDefinitions) {
    const existingDefinition = await this.getDefinition({ type });
    const existingFields = new Set(
      existingDefinition.fieldDefinitions.map((f) => f.key),
    );

    const fieldDefinitionsToCreate = newFieldDefinitions.filter(
      (f) => !existingFields.has(f.key),
    );

    if (fieldDefinitionsToCreate.length === 0) {
      return existingDefinition; // No new fields to add
    }

    const mutation = `#graphql
    mutation UpdateMetaobjectDefinition($id: ID!, $definition: MetaobjectDefinitionUpdateInput!) {
      metaobjectDefinitionUpdate(id: $id, definition: $definition) {
        metaobjectDefinition {
          id
          name
          fieldDefinitions {
            name
            key
            type {
              name
            }
          }
        }
        userErrors {
          field
          message
          code
        }
      }
    }`;

    const variables = {
      id: existingDefinition.id,
      definition: {
        fieldDefinitions: fieldDefinitionsToCreate.map((f) => ({
          create: {
            key: f.key,
            name: f.name,
            type: f.type,
          },
        })),
      },
    };

    try {
      const response = await this.admin.graphql(mutation, { variables });
      const {
        data: { metaobjectDefinitionUpdate },
      } = await response.json();

      if (metaobjectDefinitionUpdate.userErrors.length > 0) {
        throw new Error(
          metaobjectDefinitionUpdate.userErrors
            .map((e) => e.message)
            .join(", "),
        );
      }

      this.definitionCache.set(
        type,
        metaobjectDefinitionUpdate.metaobjectDefinition,
      );
      return metaobjectDefinitionUpdate.metaobjectDefinition;
    } catch (error) {
      console.error("Error updating MetaObject definition:", error);
      throw error;
    }
  }

  /**
   * Delete the definition of a MetaObject.
   * @param {Object} params - Parameters for deleting the definition.
   * @param {string} params.type - The type of the MetaObject to delete.
   * @returns {Promise<Object>} The result of the deletion operation.
   * @throws {Error} If there's an API error.
   */
  async deleteDefinition({ type }) {
    const definition = await this.getDefinition({ type });
    const mutation = `#graphql
    mutation DeleteMetaobjectDefinition($id: ID!) {
        metaobjectDefinitionDelete(id: $id) {
            deletedId
            userErrors {
                field
                message
                code
            }
        }
    }`;

    try {
      const response = await this.admin.graphql(mutation, {
        variables: { id: definition.id },
      });
      const {
        data: { metaobjectDefinitionDelete },
      } = await response.json();

      if (metaobjectDefinitionDelete.userErrors.length > 0) {
        throw new Error(
          metaobjectDefinitionDelete.userErrors
            .map((e) => e.message)
            .join(", "),
        );
      }

      this.definitionCache.delete(type);
      return metaobjectDefinitionDelete;
    } catch (error) {
      console.error("Error deleting MetaObject definition:", error);
      throw error;
    }
  }

  /**
   * Create a new MetaObject instance.
   * @param {Object} params - Parameters for creating the MetaObject.
   * @param {string} params.type - The type of the MetaObject.
   * @param {Array} params.fieldDefinitions - The field definitions.
   * @param {Object} data - The data for the MetaObject fields.
   * @returns {Promise<Object>} The created MetaObject.
   * @throws {Error} If there's an API error.
   */
  async create({ type, fieldDefinitions }, data) {
    // Update definition if new fields are added
    await this.updateDefinition(type, fieldDefinitions);

    const fields = fieldDefinitions
      .map((def) => {
        const value = data[def.key];
        // Only include the field if it has a non-null value
        return value != null
          ? {
              key: def.key,
              value: this._formatFieldValue(def.type, value),
            }
          : null;
      })
      .filter(Boolean); // Remove null entries

    const customHandle = data?.handle ? { handle: data?.handle } : {};

    const mutation = `#graphql
    mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        metaobject {
          id
          handle
          type
        }
        userErrors {
          field
          message
          code
        }
      }
    }`;

    try {
      const response = await this.admin.graphql(mutation, {
        variables: { metaobject: { type, fields, ...customHandle } },
      });
      const {
        data: {
          metaobjectCreate: { metaobject, userErrors },
        },
      } = await response.json();

      if (userErrors.length > 0) {
        throw new Error(userErrors.map((e) => e.message).join(", "));
      }

      return metaobject;
    } catch (error) {
      console.error("Error creating MetaObject:", error);
      throw error;
    }
  }

  /**
   * Find a MetaObject by ID.
   * @param {Object} params - Parameters for finding the MetaObject.
   * @param {Array} params.fieldDefinitions - The field definitions.
   * @param {string} id - The ID of the MetaObject to find.
   * @returns {Promise<Object>} The found MetaObject.
   * @throws {Error} If there's an API error.
   */
  async find({ type, fieldDefinitions }, id) {
    await this.updateDefinition(type, fieldDefinitions);

    let fields = fieldDefinitions
      .map((def) => `${def.key}: field(key: "${def.key}") { value }`)
      .join("\n");

    const query = `#graphql
    query {
        metaobject(id: "${id}") {
            id
            handle
            type
            ${fields}
        }
    }`;

    try {
      const response = await this.admin.graphql(query);
      const {
        data: { metaobject },
      } = await response.json();

      if (!metaobject) {
        throw new Error(`MetaObject not found with ID: ${id}`);
      }

      let fieldsValue = {};
      for (const def of fieldDefinitions) {
        if (def.type == "json") {
          const emptyValue = def.type?.endsWith("s") ? [] : {};
          fieldsValue[def.key] = JSON.parse(
            metaobject[def.key]?.value || emptyValue,
          );
        } else {
          fieldsValue[def.key] = metaobject[def.key]?.value || null;
        }
      }

      return {
        id: metaobject.id,
        handle: metaobject.handle,
        type: metaobject.type.split("--").pop(),
        ...fieldsValue,
      };
    } catch (error) {
      console.error("Error finding MetaObject:", error);
      throw error;
    }
  }

  /**
   * Update a MetaObject.
   * @param {Object} params - Parameters for updating the MetaObject.
   * @param {Array} params.fieldDefinitions - The field definitions.
   * @param {string} id - The ID of the MetaObject to update.
   * @param {Object} data - The updated data for the MetaObject fields.
   * @returns {Promise<Object>} The updated MetaObject.
   * @throws {Error} If there's an API error.
   */
  async update({ type, fieldDefinitions }, id, data) {
    // Update definition if new fields are added
    await this.updateDefinition(type, fieldDefinitions);

    const fields = fieldDefinitions
      .map((def) => {
        const value = this._formatFieldValue(def.type, data[def.key]);
        // Include the field if it has a non-null value or if it's explicitly set to null
        return value !== undefined
          ? {
              key: def.key,
              value: value,
            }
          : null;
      })
      .filter(Boolean); // Remove null entries

    const mutation = `#graphql
    mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
      metaobjectUpdate(id: $id, metaobject: $metaobject) {
        metaobject {
          id
          handle
          type
        }
        userErrors {
          field
          message
          code
        }
      }
    }`;

    try {
      const response = await this.admin.graphql(mutation, {
        variables: { id, metaobject: { fields } },
      });
      const {
        data: {
          metaobjectUpdate: { metaobject, userErrors },
        },
      } = await response.json();

      if (userErrors.length > 0) {
        throw new Error(userErrors.map((e) => e.message).join(", "));
      }

      return metaobject;
    } catch (error) {
      console.error("Error updating MetaObject:", error);
      throw error;
    }
  }

  /**
   * List MetaObjects with pagination.
   * @param {Object} params - Parameters for listing MetaObjects.
   * @param {string} params.type - The type of MetaObjects to list.
   * @param {Array} params.fieldDefinitions - The field definitions.
   * @param {number} [limit=50] - The number of items to return.
   * @param {string} [cursor] - The cursor for pagination.
   * @returns {Promise<Object>} The list of MetaObjects and pagination info.
   * @throws {Error} If there's an API error.
   */
  async list(
    { type, fieldDefinitions },
    limit = 50,
    cursor = null,
    queryString = "",
  ) {
    // await this.updateDefinition(type, fieldDefinitions);

    let fields = fieldDefinitions
      .map((def) => `${def.key}: field(key: "${def.key}") { value }`)
      .join("\n");

    let cursorParam = cursor ? `, after: "${cursor}"` : "";
    const query = `#graphql
    query {
        metaobjects(type: "${type}", first: ${limit}${cursorParam} ${queryString}) {
            nodes {
                id
                handle
                type
                ${fields}
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                endCursor
            }
        }
    }`;

    try {
      const response = await this.admin.graphql(query);
      const {
        data: {
          metaobjects: { nodes, pageInfo },
        },
      } = await response.json();

      const formattedNodes = nodes.map((node) => {
        let fieldsValue = {};
        for (const def of fieldDefinitions) {
          if (def.type == "json") {
            const emptyValue = def.type?.endsWith("s") ? [] : {};
            fieldsValue[def.key] = JSON.parse(
              node[def.key]?.value || emptyValue,
            );
          } else {
            fieldsValue[def.key] = node[def.key]?.value || null;
          }
        }
        return {
          id: node.id,
          handle: node.handle,
          type: node.type.split("--").pop(),
          ...fieldsValue,
        };
      });

      return { nodes: formattedNodes, pageInfo };
    } catch (error) {
      console.error("Error listing MetaObjects:", error);
      throw error;
    }
  }

  /**
   * Delete a MetaObject.
   * @param {string} id - The ID of the MetaObject to delete.
   * @returns {Promise<string>} The ID of the deleted MetaObject.
   * @throws {Error} If there's an API error.
   */
  async delete(id) {
    const mutation = `#graphql
    mutation metaobjectDelete($id: ID!) {
        metaobjectDelete(id: $id) {
            deletedId
            userErrors {
                field
                message
            }
        }
    }`;

    try {
      const response = await this.admin.graphql(mutation, {
        variables: { id },
      });
      const {
        data: {
          metaobjectDelete: { deletedId, userErrors },
        },
      } = await response.json();

      if (userErrors.length > 0) {
        throw new Error(userErrors.map((e) => e.message).join(", "));
      }

      return deletedId;
    } catch (error) {
      console.error("Error deleting MetaObject:", error);
      throw error;
    }
  }

  _formatFieldValue(type, value) {
    // Handle null or undefined values
    if (value == null) return null;

    switch (type) {
      case "json":
        // If it's already a string, assume it's properly JSON-formatted
        if (typeof value === "string") {
          try {
            // Validate that it's proper JSON
            JSON.parse(value);
            return value;
          } catch (e) {
            // If it's not valid JSON, stringify it
            return JSON.stringify(value);
          }
        }
        // For non-string values, stringify them
        return JSON.stringify(value);
      case "list.product_reference":
      case "list.variant_reference":
        // Ensure the value is an array and stringify it
        if (Array.isArray(value)) {
          return JSON.stringify(value);
        }
        // If it's not an array, return an empty array string
        return "[]";
      case "boolean":
        return value.toString();
      case "date":
        const date = value instanceof Date ? value : new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date value");
        }
        return date.toISOString().split("T")[0];
      case "date_time":
        return value instanceof Date
          ? value.toISOString()
          : new Date(value).toISOString();
      default:
        return value;
    }
  }
}
