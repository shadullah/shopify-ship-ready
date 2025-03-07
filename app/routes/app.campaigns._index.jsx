import { authenticateExtra } from "../config/shopify.js";
import { json } from "@remix-run/node";
import EmailCampaigns from "../components/contents/index.jsx"; // Adjust the path as needed
import { EmailCampaignModel } from "../models/emailCampaign.model.js";
import { EmailCampaign } from "../entities/emailCampaign.js";

export const loader = async ({ request }) => {
  const { metaobject } = await authenticateExtra(request);
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const limit = 10; // You can adjust this or make it dynamic
  const emailCampaigns = await metaobject.list(EmailCampaignModel, limit, cursor);

  return json({
    emailCampaigns,
  });
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