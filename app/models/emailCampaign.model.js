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