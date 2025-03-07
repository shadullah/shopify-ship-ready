import { authenticateExtra } from "../config/shopify.js";
import { json } from "@remix-run/node";
import EmailMarketingComponent from "../components/contents/EmailMarketingPage.jsx";
import { getEmailTemplates, getCampaigns } from "../models/emailTemplate.model.js";
import { getEmailTemplateTiers } from "../models/emailTemplateTier.model.js";

export const loader = async ({ request }) => {
    const { metaobject } = await authenticateExtra(request);

    // Fetch email templates, campaigns, and template tiers
    const emailTemplates = await getEmailTemplates();
    const campaigns = await getCampaigns();
    const templateTiers = await getEmailTemplateTiers(metaobject);

    return json({
        emailTemplates,
        campaigns,
        templateTiers,
    });
};

export async function action({ request }) {
    const { metaobject } = await authenticateExtra(request);
    const formData = await request.json();
    const actionType = formData.actionType;

    if (actionType === "deleteTemplate") {
        await metaobject.delete(formData.templateId);
        return json({
            status: {
                success: true,
                message: "Template deleted successfully",
            },
        });
    }

    if (actionType === "deleteCampaign") {
        await metaobject.delete(formData.campaignId);
        return json({
            status: {
                success: true,
                message: "Campaign deleted successfully",
            },
        });
    }

    return json({ status: "Action not recognized" });
}

export default function EmailMarketingPage() {
    return <EmailMarketingComponent />;
}