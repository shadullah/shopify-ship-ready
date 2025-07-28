// EmailCampaignModel defines the structure of an email campaign using ShipReady metaobjects.
export const EmailCampaignModel = {
    name: "Email Campaign", // Human-readable name for the model
    type: "$app:email_campaign", // Unique identifier for the metaobject type
    access: {
      admin: "MERCHANT_READ_WRITE", // Admin access level (e.g., merchant can read/write)
      storefront: "PRIVATE", // Storefront access level (e.g., private to the app)
    },
    fieldDefinitions: [
      {
        name: "Subject",
        key: "subject",
        type: "single_line_text_field", // Single-line text field for the email subject
      },
      {
        name: "Body",
        key: "body",
        type: "multi_line_text_field", // Multi-line text field for the email body
      },
      {
        name: "Logo URL",
        key: "logo_url",
        type: "url", // URL field for the brand logo
      },
      {
        name: "Status",
        key: "status",
        type: "single_line_text_field", // Single-line text field for the campaign status (e.g., draft, scheduled, sent)
      },
      {
        name: "Schedule At",
        key: "schedule_at",
        type: "date_time", // Date and time field for scheduling the campaign
      },
      {
        name: "Theme Color",
        key: "color",
        type: "color", // Color field for the email theme
      },
      {
        name: "Products reference",
        key: "products_reference",
        type: "list.variant_reference", // List of product variant references
      },
      {
        name: "Products json",
        key: "products_json",
        type: "json", // JSON field for storing product details
      },
      {
        name: "Recipient Type",
        key: "recipient_type",
        type: "single_line_text_field",
        required: true,
      },
      {
        name: "Custom Recipients",
        key: "custom_recipients",
        type: "json",
        required: false,
      },
      {
        name: "Customer Segment",
        key: "customer_segment",
        type: "single_line_text_field",
        required: false,
      },
      {
        name: "Last Sent At",
        key: "last_sent_at",
        type: "date_time",
        required: false,
      },
      {
        name: "Send Count",
        key: "send_count",
        type: "number_integer",
        required: false,
      },
      {
        name: "Created At",
        key: "created_at",
        type: "date_time", // Date and time field for when the campaign was created
      },
    ],
  };

export async function getCampaigns(metaobject) {
    try {
        const campaigns = await metaobject.list({
            type: "$app:email_campaign",
        });
        return campaigns;
    } catch (error) {
        console.error("Error fetching email campaigns:", error);
        throw error;
    }
}

export async function getCampaignById(metaobject, campaignId) {
    try {
        const campaign = await metaobject.get(campaignId);
        return campaign;
    } catch (error) {
        console.error("Error fetching email campaign:", error);
        throw error;
    }
}

export async function createCampaign(metaobject, campaignData) {
    try {
        const campaign = await metaobject.create({
            type: "$app:email_campaign",
            fields: {
                subject: campaignData.subject,
                body: campaignData.body,
                logo_url: campaignData.logo_url,
                status: campaignData.status || "draft",
                schedule_at: campaignData.schedule_at,
                color: campaignData.color,
                products_reference: campaignData.products_reference || [],
                products_json: campaignData.products_json || "{}",
                recipient_type: campaignData.recipient_type,
                custom_recipients: campaignData.custom_recipients || "[]",
                customer_segment: campaignData.customer_segment || "",
                created_at: new Date().toISOString(),
            },
        });
        return campaign;
    } catch (error) {
        console.error("Error creating email campaign:", error);
        throw error;
    }
}

export async function updateCampaign(metaobject, campaignData) {
    try {
        const campaign = await metaobject.update({
            id: campaignData.id,
            fields: {
                subject: campaignData.subject,
                body: campaignData.body,
                logo_url: campaignData.logo_url,
                status: campaignData.status,
                schedule_at: campaignData.schedule_at,
                color: campaignData.color,
                products_reference: campaignData.products_reference,
                products_json: campaignData.products_json,
                recipient_type: campaignData.recipient_type,
                custom_recipients: campaignData.custom_recipients,
                customer_segment: campaignData.customer_segment,
                last_sent_at: campaignData.last_sent_at,
                send_count: campaignData.send_count,
            },
        });
        return campaign;
    } catch (error) {
        console.error("Error updating email campaign:", error);
        throw error;
    }
}

export async function deleteCampaign(metaobject, campaignId) {
    try {
        await metaobject.delete(campaignId);
        return { success: true };
    } catch (error) {
        console.error("Error deleting email campaign:", error);
        throw error;
    }
}
