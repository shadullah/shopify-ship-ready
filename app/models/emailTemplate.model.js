export const EmailTemplateModel = {
  name: "EmailTemplate",
  type: "$app:email_template",
  access: {
      admin: "MERCHANT_READ_WRITE",
      storefront: "PUBLIC_READ",
  },
  fieldDefinitions: [
      {
          name: "Subject",
          key: "subject",
          type: "single_line_text_field",
      },
      {
          name: "Body",
          key: "body",
          type: "multi_line_text_field",
      },
      {
          name: "Logo URL",
          key: "logo_url",
          type: "url",
      },
      {
          name: "Status",
          key: "status",
          type: "single_line_text_field",
      },
      {
          name: "Created At",
          key: "created_at",
          type: "date_time",
      },
  ],
};