import { authenticateExtra } from "../config/shopify.js";
import { json } from "@remix-run/node";
import EmailCampaigns from "../components/contents/index.jsx"; // Adjust the path as needed
import { EmailCampaign } from "../entities/emailCampaign.js";

import prisma from "../config/db.js";

export const loader = async ({ request }) => { 
  try {
    console.log('🔍 Fetching email campaigns...');
    const emailCampaigns = await prisma.emailCampaign.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        scheduledEmails: true,
      },
    });

    console.log('✅ Fetched email campaigns:', emailCampaigns);

    return json({ campaigns: emailCampaigns });
  } catch (error) {
    console.error("❌ Loader error:", error);
    return json({ campaigns: [] }, { status: 500 });
  } 
};

export async function action({ request }) {
  const { admin, metaobject } = await authenticateExtra(request);
  let formData = await request.json();
  const campaign = new EmailCampaign(admin);

  if (formData.deleteObject) {
    // Delete the email campaign and its associated metaobject
    await campaign.delete(formData.campaignId); // Assuming the entity has a delete method
    await metaobject.delete(formData.objectId); // Delete the metaobject
  }

  return json({
    status: {
      success: true,
      message: "Email campaign deleted successfully",
    },
  });
}

export default function EmailCampaignsPage() {
  return <EmailCampaigns />;
}