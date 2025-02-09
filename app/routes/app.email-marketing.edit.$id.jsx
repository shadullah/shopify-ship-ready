import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { EmailTemplateForm } from "../components/contents/EmailTemplateForm.jsx";
import { authenticateExtra } from "../config/shopify.js";
import { getEmailTemplateById, updateEmailTemplate } from "../models/emailTemplate.model.js";

export const loader = async ({ params, request }) => {
    const { metaobject } = await authenticateExtra(request);
    const templateId = `gid://shopify/Metaobject/${params.id}`;

    try {
        const templateData = await getEmailTemplateById(metaobject, templateId);
        return json(templateData);
    } catch (error) {
        console.error("Error loading template data:", error);
        return json({ error: "Failed to load template data" }, { status: 500 });
    }
};

export const action = async ({ request }) => {
    const { metaobject } = await authenticateExtra(request);
    const formData = await request.json();

    if (formData.updateTemplate) {
        try {
            await updateEmailTemplate(metaobject, formData);
            return json({
                status: {
                    success: true,
                    message: "Template updated successfully",
                },
            });
        } catch (error) {
            console.error("Error updating template:", error);
            return json({ error: "Failed to update template" }, { status: 500 });
        }
    }

    return json({});
};

export default function EditEmailTemplate() {
    const loaderData = useLoaderData();

    if (loaderData.error) {
        return <div>Error: {loaderData.error}</div>;
    }

    return <EmailTemplateForm isEditing={true} />;
}