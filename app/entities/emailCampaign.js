export class EmailCampaign {
  constructor(admin) {
    this.admin = admin;
  }

  /**
   * Create a new email campaign.
   *
   * @param {Object} params - Parameters for creating the email campaign.
   * @param {string} params.name - The name of the email campaign.
   * @param {string} params.subject - The subject of the email.
   * @param {string} params.body - The body content of the email.
   * @param {string} params.logo_url - URL of the brand logo.
   * @param {string} params.status - Status of the campaign (e.g., "draft", "scheduled").
   * @param {Date} [params.schedule_at=new Date()] - Date and time to schedule the campaign.
   * @param {string} [params.color="#000000"] - Theme color for the email.
   * @param {Array} [params.products=[]] - List of product IDs or variants associated with the campaign.
   * @param {Array} [params.metafields=[]] - Metafields to attach to the campaign.
   * @returns {Promise<Object>} - The created email campaign object.
   */
  async create({
    name,
    subject,
    body,
    logo_url,
    status,
    schedule_at = new Date(),
    color = "#000000",
    products = [],
    metafields = [],
  }) {
    const mutation = `#graphql
      mutation CreateEmailCampaign($campaign: EmailCampaignInput!) {
        emailCampaignCreate(emailCampaign: $campaign) {
          emailCampaign {
            id
            name
            subject
            body
            logoUrl
            status
            scheduleAt
            color
            products {
              edges {
                node {
                  id
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`;

    const variables = {
      campaign: {
        name,
        subject,
        body,
        logoUrl: logo_url,
        status,
        scheduleAt: schedule_at.toISOString(),
        color,
        products,
        metafields,
      },
    };

    try {
      const response = await this.admin.graphql(mutation, { variables });
      const { data: { emailCampaignCreate } } = await response.json();

      if (emailCampaignCreate.userErrors && emailCampaignCreate.userErrors.length > 0) {
        const errorMessages = emailCampaignCreate.userErrors.map(
          (error) => `${error.message} (Field: ${error.field})`
        );
        throw new Error(`Failed to create email campaign: ${errorMessages.join(", ")}`);
      }

      return emailCampaignCreate.emailCampaign;
    } catch (error) {
      console.error("Error creating email campaign:", error);
      throw error;
    }
  }

  /**
   * Update an existing email campaign.
   *
   * @param {string} id - The ID of the email campaign to update.
   * @param {Object} params - Parameters for updating the email campaign.
   * @param {string} [params.name] - Updated name of the email campaign.
   * @param {string} [params.subject] - Updated subject of the email.
   * @param {string} [params.body] - Updated body content of the email.
   * @param {string} [params.logo_url] - Updated URL of the brand logo.
   * @param {string} [params.status] - Updated status of the campaign.
   * @param {Date} [params.schedule_at] - Updated date and time to schedule the campaign.
   * @param {string} [params.color] - Updated theme color for the email.
   * @param {Array} [params.products=[]] - Updated list of product IDs or variants.
   * @param {Array} [params.metafields=[]] - Updated metafields to attach to the campaign.
   * @returns {Promise<Object>} - The updated email campaign object.
   */
  async update(id, {
    name,
    subject,
    body,
    logo_url,
    status,
    schedule_at,
    color,
    products = [],
    metafields = [],
  }) {
    const mutation = `#graphql
      mutation UpdateEmailCampaign($id: ID!, $campaign: EmailCampaignInput!) {
        emailCampaignUpdate(id: $id, emailCampaign: $campaign) {
          emailCampaign {
            id
            name
            subject
            body
            logoUrl
            status
            scheduleAt
            color
            products {
              edges {
                node {
                  id
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`;

    const variables = {
      id,
      campaign: {
        name,
        subject,
        body,
        logoUrl: logo_url,
        status,
        scheduleAt: schedule_at ? schedule_at.toISOString() : null,
        color,
        products,
        metafields,
      },
    };

    try {
      const response = await this.admin.graphql(mutation, { variables });
      const { data: { emailCampaignUpdate } } = await response.json();

      if (emailCampaignUpdate.userErrors && emailCampaignUpdate.userErrors.length > 0) {
        const errorMessages = emailCampaignUpdate.userErrors.map(
          (error) => `${error.message} (Field: ${error.field})`
        );
        throw new Error(`Failed to update email campaign: ${errorMessages.join(", ")}`);
      }

      return emailCampaignUpdate.emailCampaign;
    } catch (error) {
      console.error("Error updating email campaign:", error);
      throw error;
    }
  }

  /**
   * Delete an email campaign.
   *
   * @param {string} id - The ID of the email campaign to delete.
   * @returns {Promise<string>} - The ID of the deleted email campaign.
   */
  async delete(id) {
    const mutation = `#graphql
      mutation DeleteEmailCampaign($id: ID!) {
        emailCampaignDelete(id: $id) {
          deletedEmailCampaignId
          userErrors {
            field
            message
          }
        }
      }`;

    const variables = { id };

    try {
      const response = await this.admin.graphql(mutation, { variables });
      const { data: { emailCampaignDelete } } = await response.json();

      if (emailCampaignDelete.userErrors && emailCampaignDelete.userErrors.length > 0) {
        const errorMessages = emailCampaignDelete.userErrors.map(
          (error) => `${error.message} (Field: ${error.field})`
        );
        throw new Error(`Failed to delete email campaign: ${errorMessages.join(", ")}`);
      }

      return emailCampaignDelete.deletedEmailCampaignId;
    } catch (error) {
      console.error("Error deleting email campaign:", error);
      throw error;
    }
  }

  /**
   * Query email campaigns.
   *
   * @returns {Promise<Array>} - A list of email campaigns.
   */
  async query() {
    const query = `#graphql
      query {
        emailCampaigns(first: 10) {
          edges {
            node {
              id
              name
              subject
              body
              logoUrl
              status
              scheduleAt
              color
              products {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }`;

    try {
      const response = await this.admin.graphql(query);
      const { data: { emailCampaigns: { edges } } } = await response.json();
      return edges.map((edge) => edge.node);
    } catch (error) {
      console.error("Error querying email campaigns:", error);
      throw error;
    }
  }

  /**
   * Set metafields for an email campaign.
   *
   * @param {string} campaignId - The ID of the email campaign.
   * @param {Array} metafields - Array of metafields to set.
   * @returns {Promise<Array>} - The updated metafields.
   */
  async setMetafields(campaignId, metafields) {
    const mutation = `#graphql
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            key
            namespace
            value
          }
          userErrors {
            field
            message
          }
        }
      }`;

    const variables = {
      metafields: metafields.map((metafield) => ({
        ownerId: campaignId,
        namespace: metafield.namespace,
        key: metafield.key,
        value: typeof metafield.value === "string" ? metafield.value : JSON.stringify(metafield.value),
        type: metafield.type || "json",
      })),
    };

    try {
      const response = await this.admin.graphql(mutation, { variables });
      const { data: { metafieldsSet } } = await response.json();

      if (metafieldsSet.userErrors && metafieldsSet.userErrors.length > 0) {
        const errorMessages = metafieldsSet.userErrors.map(
          (error) => `${error.message} (Field: ${error.field})`
        );
        throw new Error(`Failed to set metafields: ${errorMessages.join(", ")}`);
      }

      return metafieldsSet.metafields;
    } catch (error) {
      console.error("Error setting metafields:", error);
      throw error;
    }
  }

  /**
   * Get an email campaign with its metafields.
   *
   * @param {string} id - The ID of the email campaign.
   * @param {string} metafieldKey - The key of the metafield to retrieve.
   * @param {string} metafieldNamespace - The namespace of the metafield to retrieve.
   * @returns {Promise<Object>} - The email campaign with the specified metafield.
   */
  async getCampaignWithMetafield(id, metafieldKey, metafieldNamespace) {
    const query = `#graphql
      query {
        emailCampaignNode(id: "${id}") {
          id
          name
          subject
          body
          logoUrl
          status
          scheduleAt
          color
          metafield(key: "${metafieldKey}", namespace: "${metafieldNamespace}") {
            id
            key
            namespace
            value
          }
        }
      }`;

    try {
      const response = await this.admin.graphql(query);
      const { data: { emailCampaignNode } } = await response.json();
      return emailCampaignNode;
    } catch (error) {
      console.error("Error getting email campaign with metafield:", error);
      throw error;
    }
  }
}