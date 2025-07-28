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

export async function getEmailTemplateById(metaobject, templateId) {
    try {
        const template = await metaobject.get(templateId);
        return template;
    } catch (error) {
        console.error("Error fetching email template:", error);
        throw error;
    }
}

export async function updateEmailTemplate(metaobject, templateData) {
    try {
        const template = await metaobject.update({
            id: templateData.id,
            fields: {
                subject: templateData.subject,
                body: templateData.body,
                logo_url: templateData.logo_url,
                status: templateData.status,
            },
        });
        return template;
    } catch (error) {
        console.error("Error updating email template:", error);
        throw error;
    }
}

export async function getEmailTemplates(metaobject) {
    try {
        const templates = await metaobject.list({
            type: "$app:email_template",
        });
        return templates;
    } catch (error) {
        console.error("Error fetching email templates:", error);
        throw error;
    }
}

export async function createEmailTemplate(metaobject, templateData) {
    try {
        const template = await metaobject.create({
            type: "$app:email_template",
            fields: {
                subject: templateData.subject,
                body: templateData.body,
                logo_url: templateData.logo_url,
                status: templateData.status || "draft",
                created_at: new Date().toISOString(),
            },
        });
        return template;
    } catch (error) {
        console.error("Error creating email template:", error);
        throw error;
    }
}

export async function deleteEmailTemplate(metaobject, templateId) {
    try {
        await metaobject.delete(templateId);
        return { success: true };
    } catch (error) {
        console.error("Error deleting email template:", error);
        throw error;
    }
}
