import { authenticateExtra } from "../config/shopify.js";
import { json } from "@remix-run/node";
import EmailMarketingComponent from "../components/contents/EmailMarketingPage.jsx"; // Renamed import
import { getEmailTemplates, getCampaigns } from "../models/emailTemplate.model.js";

export const loader = async ({ request }) => {
    const { metaobject } = await authenticateExtra(request);

    // Fetch email templates and campaigns
    const emailTemplates = await getEmailTemplates();
    const campaigns = await getCampaigns();

    return json({
        emailTemplates,
        campaigns,
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
    return <EmailMarketingComponent />; // Use the renamed import
}