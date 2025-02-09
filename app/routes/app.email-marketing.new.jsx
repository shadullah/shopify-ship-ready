import { json, redirect } from "@remix-run/react";
import { EmailTemplateForm } from "../components/contents/EmailTemplateForm.jsx";
import { authenticateExtra } from "../config/shopify.js";
import { createEmailTemplate } from "../models/emailTemplate.model.js";

export const loader = async ({ request }) => {
    const { admin } = await authenticateExtra(request);
    return json({});
};

export const action = async ({ request }) => {
    const { metaobject } = await authenticateExtra(request);
    const formData = await request.json();

    if (formData.createTemplate) {
        try {
            const newTemplate = await createEmailTemplate(metaobject, formData);
            return redirect(`/app/email-marketing/edit/${newTemplate.id.split("/").pop()}`);
        } catch (error) {
            return json(
                {
                    status: {
                        success: false,
                        message: `Error creating template: ${error.message}`,
                    },
                },
                { status: 400 },
            );
        }
    }

    return json({});
};

export default function NewEmailTemplatePage() {
    return <EmailTemplateForm />;
}